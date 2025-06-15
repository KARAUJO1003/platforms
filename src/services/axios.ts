import "dotenv/config";
import https from "https";
import axios from "axios";
import { toast } from "sonner";
import { parseCookies, setCookie } from "nookies";
import { sessionConfig } from "@/config/auth/session-config";
import { clearCacheNavegador } from "@/config/auth/session-utils";

let readFileSync;
if (typeof window === "undefined") {
  readFileSync = require("fs").readFileSync;
}

let httpsAgent;
if (readFileSync) {
  httpsAgent = {
    key: readFileSync(process.env.NEXT_PUBLIC_KEY_KEY),
    cert: readFileSync(process.env.NEXT_PUBLIC_KEY_CERT),
    // ca: readFileSync(process.env.NEXT_PUBLIC_KEY_CA),
    rejectUnauthorized: false,
  };
}

httpsAgent = new https.Agent(httpsAgent);

const baseURL =
  process.env.APP_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_PROD_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${parseCookies()[sessionConfig.TOKEN_NAME]}`,
    "x-access-token": parseCookies()[sessionConfig.TOKEN_NAME],
  },
  httpsAgent: httpsAgent,
});

// Você pode adicionar interceptors aqui se necessário
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = parseCookies()[sessionConfig.TOKEN_NAME];
    if (accessToken) {
      config.headers["x-access-token"] = accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.Accept = "application/json";
      config.headers.timeout = 20000;
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);

    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    // Qualquer código de status entre 2xx fará com que esta função seja acionada
    return response;
  },
  async (error: any) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          let cokkies = parseCookies();
          const refreshToken = cokkies[sessionConfig.REFRESH_TOKEN_NAME];
          if (refreshToken && !isRefreshing) {
            isRefreshing = true;

            return axiosInstance
              .post("/auth/refresh", { refreshToken })
              .then(async (res) => {
                const { token, refreshToken: newRefreshToken } = res.data;

                setCookie(null, sessionConfig.TOKEN_NAME, token, { path: "/" });
                setCookie(
                  null,
                  sessionConfig.REFRESH_TOKEN_NAME,
                  newRefreshToken,
                  { path: "/" }
                );

                axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
                axiosInstance.defaults.headers["x-access-token"] = token;

                failedRequestsQueue.forEach((req) => req.onSuccess(token));
                failedRequestsQueue = [];
                isRefreshing = false;

                error.config.headers.Authorization = `Bearer ${token}`;
                error.config.headers["x-access-token"] = token;
                return axiosInstance(error.config);
              })
              .catch((err) => {
                failedRequestsQueue.forEach((req) => req.onFailure(err));
                failedRequestsQueue = [];
                isRefreshing = false;
                clearCacheNavegador(true);
                console.log("Erro ao atualizar o token:", err);
                toast.error(
                  "Sessão expirada. Por favor, faça login novamente."
                );
                return Promise.reject(err);
              });
          }
          break;
        case 403:
          toast.error("Você não tem permissão para acessar este recurso.");
          break;
        case 404:
          toast.error("O recurso solicitado não foi encontrado.");
          break;
        case 500:
          toast.error("Erro interno do servidor. Tente novamente mais tarde.");
          break;
        default:
          toast.error(
            `Ocorreu um erro: ${response.data?.message || "Erro desconhecido"}`
          );
      }
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta
      toast.error(
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    } else {
      // Algo aconteceu na configuração da requisição que acionou um erro
      toast.error("Erro ao configurar a requisição.");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as api };

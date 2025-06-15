"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  format,
  isValid,
  formatRelative,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChartDisplayProps {
  data: any[];
  chartType: "bar" | "line" | "pie" | "area";
  xAxis: string;
  yAxis: string[];
  title: string;
  showLegend: boolean;
  gridLines: boolean;
  stacked: boolean;
  height?: number;
  palette: string[]; // ADICIONADO
  barOrientation?: "vertical" | "horizontal"; // ADICIONADO
  dateFormat?: "dia" | "semana" | "mes" | "ano" | "relativo"; // ADICIONADO
  orderByDate?: boolean; // ADICIONADO
  omitZero?: boolean; // ADICIONADO
  showLabels?: boolean;
  labelAngle?: number;
}

export function ChartDisplay({
  data,
  chartType,
  xAxis,
  yAxis,
  title,
  showLegend,
  gridLines,
  stacked,
  height,
  palette,
  barOrientation = "vertical",
  dateFormat = "dia",
  orderByDate = false,
  omitZero = false,
  showLabels = true,
  labelAngle = 0,
}: ChartDisplayProps) {
  // 1. Filtrar valores zerados se omitZero estiver ativo
  const filteredData = useMemo(() => {
    if (!omitZero) return data;
    return data.filter((item) =>
      yAxis.some((key) => {
        const value = item[key];
        return (
          typeof value === "number" &&
          value !== 0 &&
          value !== null &&
          value !== undefined
        );
      })
    );
  }, [data, yAxis, omitZero]);

  // 2. Detectar se o eixo X é do tipo data (date)
  const isXAxisDate = useMemo(() => {
    // Tenta detectar se o campo do eixo X é uma data válida em pelo menos um item
    return filteredData.some((item) => {
      const value = item[xAxis];
      if (!value) return false;
      const date = new Date(value);
      return isValid(date) && typeof value !== "number";
    });
  }, [filteredData, xAxis]);

  // 3. Ordenar por data se orderByDate estiver ativo e o campo for do tipo data
  const orderedData = useMemo(() => {
    if (!orderByDate || !isXAxisDate) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aDate = new Date(a[xAxis]);
      const bDate = new Date(b[xAxis]);
      return aDate.getTime() - bDate.getTime();
    });
  }, [filteredData, orderByDate, xAxis, isXAxisDate]);

  // 4. Formatar datas conforme dateFormat usando date-fns, apenas se o eixo X for data
  const formattedData = useMemo(() => {
    if (!orderedData.length) return orderedData;
    if (!isXAxisDate) return orderedData;
    return orderedData.map((item) => {
      const newItem = { ...item };
      if (item[xAxis]) {
        const date = new Date(item[xAxis]);
        if (isValid(date)) {
          switch (dateFormat) {
            case "dia":
              newItem[xAxis] = format(date, "dd/MM/yyyy");
              break;
            case "semana": {
              // Exibe o intervalo da semana: dd - dd/MMM/yy
              const start = startOfWeek(date, { weekStartsOn: 1 });
              const end = endOfWeek(date, { weekStartsOn: 1 });
              newItem[xAxis] = `${format(start, "dd", {
                locale: ptBR,
              })} - ${format(end, "dd/MMM/yy", { locale: ptBR })}`;
              break;
            }
            case "mes":
              newItem[xAxis] = format(date, "MM/yyyy");
              break;
            case "ano":
              newItem[xAxis] = format(date, "yyyy");
              break;
            case "relativo":
              newItem[xAxis] = formatRelative(date, new Date(), {
                locale: ptBR,
              });
              break;
            default:
              break;
          }
        }
      }
      return newItem;
    });
  }, [orderedData, xAxis, dateFormat, isXAxisDate]);

  // 5. Gerar as cores da paleta para cada série/categoria
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    yAxis.forEach((key, index) => {
      config[key] = {
        label: key,
        color: palette[index % palette.length],
      };
    });
    return config;
  }, [yAxis, palette]);

  // 6. Definir layout do gráfico de barras conforme orientação
  const barLayout = barOrientation === "horizontal" ? "vertical" : "horizontal";

  // 7. Renderização dos gráficos usando as cores da paleta
  if (!formattedData.length || !xAxis || !yAxis.length) {
    return (
      <div
        className="flex justify-center items-center border-2 border-dashed rounded-lg"
        style={{ height: height }}
      >
        <div className="text-muted-foreground text-center">
          <p>Select data fields to generate a chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 font-medium text-lg text-center">{title}</h3>
      <div style={{ height: height || "100%" }}>
        <ChartContainer
          config={chartConfig}
          style={{ height: "100%" }}
        >
          {chartType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={formattedData}
              layout={barLayout}
            >
              {gridLines && <CartesianGrid strokeDasharray="3 3" />}
              {barOrientation === "horizontal" ? (
                <>
                  <YAxis
                    dataKey={xAxis}
                    type="category"
                    width={120}
                    tickLine={false}
                    axisLine={false}
                  />
                  <XAxis type="number" />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={xAxis}
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    angle={showLabels ? labelAngle : 0}
                    textAnchor="end"
                    tick={showLabels}
                  />
                  <YAxis type="number" />
                </>
              )}
              <ChartTooltip content={<ChartTooltipContent />} />
              {yAxis.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={palette[index % palette.length]}
                  stackId={stacked ? "stack" : undefined}
                >
                  {showLabels && (
                    <LabelList
                      dataKey={key}
                      position={
                        barOrientation === "horizontal" ? "right" : "top"
                      }
                      angle={0}
                      // fill="#222"
                      fontSize={12}
                    />
                  )}
                </Bar>
              ))}
              {showLegend && <Legend />}
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart
              accessibilityLayer
              data={formattedData}
            >
              {gridLines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={xAxis}
                tickLine={false}
                axisLine={false}
                angle={showLabels ? labelAngle : 0}
                tick={showLabels}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {yAxis.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={palette[index % palette.length]}
                  activeDot={{ r: 8 }}
                >
                  {showLabels && (
                    <LabelList
                      dataKey={key}
                      position="top"
                      // fill="#222"
                      fontSize={12}
                    />
                  )}
                </Line>
              ))}
              {showLegend && <Legend />}
            </LineChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <Pie
                data={formattedData}
                nameKey={xAxis}
                dataKey={yAxis[0]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                // label={showLabels}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={palette[index % palette.length]}
                  />
                ))}
                {showLabels && (
                  <LabelList
                    dataKey={yAxis[0]}
                    position="outside"
                    // fill="#222"
                    fontSize={12}
                  />
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              {showLegend && (
                <Legend
                  payload={yAxis.map((key, idx) => ({
                    value: key,
                    type: "square",
                    color: palette[idx % palette.length],
                    id: key,
                  }))}
                />
              )}
            </PieChart>
          ) : (
            <AreaChart
              accessibilityLayer
              data={formattedData}
            >
              {gridLines && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={xAxis}
                tickLine={false}
                axisLine={false}
                angle={showLabels ? labelAngle : 0}
                tick={showLabels}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {yAxis.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId={stacked ? "stack" : undefined}
                  stroke={palette[index % palette.length]}
                  fill={palette[index % palette.length]}
                  fillOpacity={0.3}
                >
                  {showLabels && (
                    <LabelList
                      dataKey={key}
                      position="top"
                      // fill="#222"
                      fontSize={12}
                    />
                  )}
                </Area>
              ))}
              {showLegend && <Legend />}
            </AreaChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}

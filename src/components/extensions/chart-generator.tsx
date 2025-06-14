"use client";
import { useState, useMemo } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  FullscreenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { flattenData, getAvailableFields } from "@/lib/data-utils";
import { ChartDisplay } from "./chart-display";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface ChartGeneratorProps<T> {
  data: T[];
  yAxixOptions?: { key: keyof T; type: string }[];
  xAxisOptions?: { key: keyof T; type: string }[];
  defaultYAxis?: (keyof T)[];
  defaultXAxis?: keyof T | string;
  groupByOptions?: { key: keyof T; type: string }[];
}

const colorPalettes = {
  default: [
    "#6366f1",
    "#f59e42",
    "#10b981",
    "#ef4444",
    "#fbbf24",
    "#3b82f6",
    "#a21caf",
    "#14b8a6",
    "#f472b6",
    "#64748b",
  ],
  pastel: [
    "#a3a3ff",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#bdb2ff",
    "#ffc6ff",
    "#fffffc",
    "#b5ead7",
    "#ffdac1",
  ],
  vibrant: [
    "#ff595e",
    "#ffca3a",
    "#8ac926",
    "#1982c4",
    "#6a4c93",
    "#ff6f61",
    "#dfe2f1",
    "#ffe156",
    "#6a0572",
    "#ff9f00",
  ],
  monochrome: [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#cccccc",
    "#e6e6e6",
    "#f2f2f2",
    "#ffffff",
  ],
  warm: [
    "#ff6b6b",
    "#f7d794",
    "#f8c291",
    "#e77f67",
    "#cf6a87",
    "#dfe4ea",
    "#2ed573",
    "#1e90ff",
    "#ff9ff3",
    "#ffbe76",
  ],
  cool: [
    "#74b9ff",
    "#a29bfe",
    "#dfe6e9",
    "#00b894",
    "#00cec9",
    "#0984e3",
    "#6c5ce7",
    "#fd79a8",
    "#ffeaa7",
    "#fab1a0",
  ],
  neon: [
    "#dfe6e9",
    "#00b894",
    "#00cec9",
    "#0984e3",
    "#6c5ce7",
    "#fd79a8",
    "#ffeaa7",
    "#fab1a0",
    "#ff7675",
    "#74b9ff",
  ],
  dark: [
    "#2d3436",
    "#636e72",
    "#b2bec3",
    "#dfe6e9",
    "#0984e3",
    "#00cec9",
    "#00b894",
    "#ffeaa7",
    "#fab1a0",
    "#ff7675",
  ],
  light: [
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#6c757d",
    "#495057",
    "#343a40",
    "#212529",
  ],
  pastelBright: [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
    "#fffffc",
    "#f3e8f2",
  ],
  earthTones: [
    "#d9bf77",
    "#a8c686",
    "#f2e2d2",
    "#b5a99d",
    "#7d6b8c",
    "#c4a69f",
    "#e3b0c1",
    "#f7c6c7",
    "#f0e5d8",
    "#b8d8d8",
  ],
};

export function ChartGenerator<T>({
  data,

  yAxixOptions,
  xAxisOptions,
  defaultYAxis = [],
  defaultXAxis = "",
  groupByOptions = [],
}: ChartGeneratorProps<T>) {
  // Flatten nested data for charting

  const flattenedData = useMemo(() => flattenData(data), [data]);

  // Get available fields from the flattened data
  const availableFields = useMemo(
    () => getAvailableFields(flattenedData),
    [flattenedData]
  );

  // Chart configuration state
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">(
    "bar"
  );
  const [xAxis, setXAxis] = useState<any>(
    defaultXAxis || availableFields[0]?.key
  );
  const [yAxis, setYAxis] = useState<any[]>(defaultYAxis);
  const [chartTitle, setChartTitle] = useState("Data Visualization");
  const [showLegend, setShowLegend] = useState(true);
  const [gridLines, setGridLines] = useState(true);
  const [stacked, setStacked] = useState(false);
  const [chartHeight, setChartHeight] = useState<number>();
  const [invertAxes, setInvertAxes] = useState(false);
  const [palette, setPalette] = useState<keyof typeof colorPalettes>("default");
  const [barOrientation, setBarOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");
  const [dateFormat, setDateFormat] = useState<
    "dia" | "semana" | "mes" | "ano" | "relativo"
  >("dia");
  const [orderByDate, setOrderByDate] = useState(false);
  const [omitZero, setOmitZero] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [labelAngle, setLabelAngle] = useState(0);
  const [groupBy, setGroupBy] = useState<string | undefined>(undefined);

  // Add a field to Y axis
  const addYAxis = (field: string) => {
    if (!yAxis.includes(field)) {
      setYAxis([...yAxis, field]);
    }
  };

  // Remove a field from Y axis
  const removeYAxis = (field: string) => {
    setYAxis(yAxis.filter((y) => y !== field));
  };

  // Filter fields by type for X and Y axis selection
  const categoricalFields =
    xAxisOptions ||
    availableFields.filter(
      (field) =>
        field.type === "string" ||
        field.type === "boolean" ||
        field.type === "date"
    );

  const numericalFields =
    yAxixOptions || availableFields.filter((field) => field.type === "number");

  const groupedData = useMemo(() => {
    if (!groupBy) return flattenedData;
    const groups: Record<string, any> = {};
    flattenedData.forEach((item) => {
      const key = item[groupBy] ?? "Sem valor";
      if (!groups[key]) {
        groups[key] = { ...item, count: 0 };
        // Zera todos os campos numéricos para somar corretamente
        numericalFields.forEach((field) => {
          groups[key][field.key] = 0;
        });
      }
      numericalFields.forEach((field) => {
        groups[key][field.key] += Number(item[field.key]) || 0;
      });
      groups[key].count += 1;
    });
    return Object.values(groups);
  }, [flattenedData, groupBy, numericalFields]);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>
          Gerador de Gráficos
          <Badge
            className="ml-2"
            roundedVariant={"full"}
            variant="secondary"
          >
            Beta
          </Badge>
          {
            // length of flattenedData > 0
            flattenedData.length > 0 ? (
              <span className="ml-2 text-muted-foreground text-sm">
                {flattenedData.length} registros
              </span>
            ) : (
              <span className="ml-2 text-red-500 text-sm">
                Nenhum dado disponível
              </span>
            )
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 pt-4">
          <div className="space-y-6">
            <div>
              <Label htmlFor="chart-title">Título do Gráfico</Label>
              <Input
                id="chart-title"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Tipo de Gráfico</Label>
              <Tabs
                defaultValue="bar"
                className="mt-2"
                onValueChange={(value) => setChartType(value as any)}
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger
                    value="bar"
                    className="flex items-center gap-2"
                  >
                    <BarChart className="w-4 h-4" />
                    Barra
                  </TabsTrigger>
                  <TabsTrigger
                    value="line"
                    className="flex items-center gap-2"
                  >
                    <LineChart className="w-4 h-4" />
                    Linha
                  </TabsTrigger>
                  <TabsTrigger
                    value="pie"
                    className="flex items-center gap-2"
                  >
                    <PieChart className="w-4 h-4" />
                    Pizza
                  </TabsTrigger>
                  <TabsTrigger
                    value="area"
                    className="flex items-center gap-2"
                  >
                    <AreaChart className="w-4 h-4" />
                    Área
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label htmlFor="group-by">Agrupar por</Label>
              <Select
                value={groupBy}
                onValueChange={(value) =>
                  setGroupBy(value === "void" ? undefined : value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a coluna para agrupar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="void">Nenhum</SelectItem>
                  {groupByOptions.map((field) => (
                    <SelectItem
                      key={String(field.key)}
                      value={String(field.key)}
                    >
                      {String(field.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {xAxisOptions?.find((field) => field.key === xAxis)?.type ===
              "date" && (
              <div>
                <Label>Formato da Data</Label>
                <Select
                  value={dateFormat}
                  onValueChange={(value) =>
                    setDateFormat(
                      value as "dia" | "semana" | "mes" | "ano" | "relativo"
                    )
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Escolha o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dia">Dia</SelectItem>
                    <SelectItem value="semana">Semana</SelectItem>
                    <SelectItem value="mes">Mês</SelectItem>
                    <SelectItem value="ano">Ano</SelectItem>
                    <SelectItem value="relativo">Relativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="x-axis">Eixo X (Categoria)</Label>
              <Select
                value={xAxis}
                onValueChange={setXAxis}
              >
                <SelectTrigger
                  id="x-axis"
                  className="mt-1"
                >
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  {categoricalFields.map((field) => (
                    <SelectItem
                      key={String(field.key)}
                      value={String(field.key)}
                    >
                      {String(field.key)} ({field.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Eixo Y (Valores)</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {numericalFields.map((field) => (
                  <div
                    key={String(field.key)}
                    className="flex items-center space-x-2"
                  >
                    <Switch
                      checked={yAxis.includes(String(field.key))}
                      onCheckedChange={(checked) => {
                        if (checked) addYAxis(String(field.key));
                        else removeYAxis(String(field.key));
                      }}
                    />
                    <span>{String(field.key)}</span>
                  </div>
                ))}
                {numericalFields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhum campo numérico disponível
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {chartType === "bar" && (
                <div className="flex justify-between items-center">
                  <Label>Orientação</Label>
                  <ToggleGroup
                    type="single"
                    variant={"filled"}
                    value={barOrientation}
                    onValueChange={(value) =>
                      setBarOrientation(value as "vertical" | "horizontal")
                    }
                    className="ml-auto"
                  >
                    <ToggleGroupItem
                      value="vertical"
                      className="disabled:opacity-100 min-w-24 text-center"
                      disabled={barOrientation === "vertical"}
                    >
                      Vertical
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="horizontal"
                      disabled={barOrientation === "horizontal"}
                      className="disabled:opacity-100 min-w-24 text-center"
                    >
                      Horizontal
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}

              <div className="items-center grid grid-cols-2">
                <Label>Paleta de Cores</Label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-muted mt-1 ml-auto w-full"
                    >
                      {palette}
                      <div className="flex gap-1 ml-auto">
                        {colorPalettes[palette].map((color, index) => (
                          <div
                            key={index}
                            className="rounded-sm size-3"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="ml-auto">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Escolha a paleta de cores
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={palette}
                      onValueChange={(value) =>
                        setPalette(value as keyof typeof colorPalettes)
                      }
                    >
                      {Object.keys(colorPalettes).map((key) => (
                        <DropdownMenuRadioItem
                          key={key}
                          value={key}
                        >
                          <div className="flex justify-between items-center gap-6 w-full">
                            {key}
                            <div className="flex gap-1 ml-auto">
                              {colorPalettes[
                                key as keyof typeof colorPalettes
                              ].map((color, index) => (
                                <div
                                  key={index}
                                  className="rounded-sm size-3"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="show-legend">Exibir legenda</Label>
                <Switch
                  id="show-legend"
                  checked={showLegend}
                  onCheckedChange={setShowLegend}
                />
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="grid-lines">Linhas de grade</Label>
                <Switch
                  id="grid-lines"
                  checked={gridLines}
                  onCheckedChange={setGridLines}
                />
              </div>

              {(chartType === "bar" || chartType === "area") && (
                <div className="flex justify-between items-center">
                  <Label htmlFor="stacked">Empilhar</Label>
                  <Switch
                    id="stacked"
                    checked={stacked}
                    onCheckedChange={setStacked}
                  />
                </div>
              )}
              {/* <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="chart-height">Altura do gráfico</Label>
                  <span>{chartHeight}px</span>
                </div>
                <Slider
                  id="chart-height"
                  min={200}
                  disabled
                  max={800}
                  step={10}
                  value={[chartHeight || 0]}
                  onValueChange={(value) => setChartHeight(value[0])}
                />
              </div> */}

              {/* {xAxisOptions?.find((field) => field.key === xAxis)?.type ===
                "date" && (
                <div className="flex justify-between items-center">
                  <Label>Ordenar por Data</Label>
                  <Switch
                    checked={orderByDate}
                    onCheckedChange={setOrderByDate}
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <Label>Omitir valores zerados</Label>
                <Switch
                  checked={omitZero}
                  onCheckedChange={setOmitZero}
                />
              </div> */}
              <div className="flex justify-between items-center">
                <Label>Exibir labels</Label>
                <Switch
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
              </div>
              {showLabels && (
                <div className="flex justify-between items-center">
                  <Label>Ângulo das labels</Label>
                  <Input
                    type="number"
                    min={-90}
                    max={90}
                    value={labelAngle}
                    onChange={(e) => setLabelAngle(Number(e.target.value))}
                    className="w-20"
                    step={15}
                  />
                </div>
              )}
            </div>
          </div>

          <Card className="lg:col-span-2 p-4 overflow-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                >
                  <FullscreenIcon className="w-4 h-4" />
                  <span className="sr-only">Tela cheia</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="p-8 w-full max-w-[60%] h-auto overflow-auto">
                <div className="flex justify-center items-center h-full">
                  <ChartDisplay
                    data={flattenedData}
                    chartType={chartType}
                    xAxis={invertAxes ? yAxis[0] || "" : xAxis}
                    yAxis={invertAxes ? [xAxis] : yAxis}
                    title={chartTitle}
                    showLegend={showLegend}
                    gridLines={gridLines}
                    stacked={stacked}
                    height={chartHeight}
                    palette={colorPalettes[palette]}
                    barOrientation={barOrientation}
                    dateFormat={dateFormat}
                    showLabels={showLabels}
                    labelAngle={labelAngle}
                    // ...outras opções
                  />
                </div>
              </DialogContent>
            </Dialog>

            <ChartDisplay
              data={groupedData}
              chartType={chartType}
              xAxis={invertAxes ? yAxis[0] || "" : xAxis}
              yAxis={invertAxes ? [xAxis] : yAxis}
              title={chartTitle}
              showLegend={showLegend}
              gridLines={gridLines}
              stacked={stacked}
              height={chartHeight}
              palette={colorPalettes[palette]}
              barOrientation={barOrientation}
              dateFormat={dateFormat}
              showLabels={showLabels}
              labelAngle={labelAngle}
              // ...outras opções
            />
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

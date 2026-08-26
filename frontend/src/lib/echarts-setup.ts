import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  DatasetComponent,
  CanvasRenderer,
]);

export default echarts;
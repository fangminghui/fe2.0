<template>
  <c-data-predict
    v-for="(item, index) in dataList"
    :key="index"
    :divId="'line'+index"
    :lable="item.lable"
    :echarts="echarts"
    :area="item.areaValue"
    @finish="finish"
  />
</template>

<script>
import axios from "axios";
import CDataPredict from "../components/CDataPredict";
import * as echarts from "echarts/core";
import {
  LegendComponent,
  GridComponent,
  TitleComponent,
  DataZoomComponent,
  TooltipComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  GridComponent,
  LegendComponent,
  LineChart,
  TitleComponent,
  CanvasRenderer,
  TooltipComponent,
  DataZoomComponent,
]);

export default {
  components: { CDataPredict },
  mounted() {
    this.getData();
  },
  data() {
    return {
      echarts: echarts,
      dataList: [],
    };
  },
  methods: {
    async getData() {
      this.$emit("loading");
      let dataList = await axios.get("/api/forecast/param");
      this.dataList = dataList.data.data;
    },
    finish() {
      this.$emit("finish");
    },
  },
};
</script>

<style>
.a {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<template>
  <div :id="divId" class="line_chart"></div>
</template>

<script>
import publicFunc from "../publicFunc";
export default {
  props: { divId: String, area: String, echarts: Object, lable: String },
  mounted() {
    this.getData();
  },
  data() {
    return {
      api: "/api/forecast",
    };
  },
  methods: {
    async getData() {
      let result = await publicFunc.getData(this.api, { area: this.area }, 0);
      this.drawLine(this.divId, this.lable, "m³", result);
    },
    drawLine(dom, text, formatter, data) {
      let xData = [];
      let realData = [];
      let predictData = [];
      for (let obj of data) {
        xData.push(obj.date);
        if (obj.real !== null) {
          realData.push(obj.real.toFixed(2));
        } else {
          realData.push(0);
        }
        if (obj.predict !== null) {
          predictData.push(obj.predict.toFixed(2));
        } else {
          predictData.push(0);
        }
      }
      let myChart = this.echarts.init(document.getElementById(dom));
      let option = {
        title: {
          text: text,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value} " + formatter,
            },
          },
        ],
        grid: [
          {
            left: 70,
            right: 50,
          },
        ],
        dataZoom: [
          {
            show: true,
            realtime: true,
          },
        ],
        series: [
          {
            type: "line",
            symbol: "none",
            data: realData,
          },
          {
            type: "line",
            symbol: "none",
            data: predictData,
          },
        ],
      };
      myChart.setOption(option);
      this.$emit("finish");
    },
  },
};
</script>

<style>
.line_chart {
  width: 100%;
  height: 45vh;
  padding-top: 2vh;
  border-top: 1px solid #c6c6c6;
}

.van-swipe__indicator {
  background: black;
}
</style>
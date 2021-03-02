<template>
  <div id="line1" class="line_chart"></div>
  <div id="line2" class="line_chart"></div>
  <swipe class="my-swipe">
    <swipe-item>
      <div id="line3" class="line_chart"></div>
    </swipe-item>
    <swipe-item>
      <div id="line4" class="line_chart"></div>
    </swipe-item>
  </swipe>
</template>

<script>
import { Swipe, SwipeItem } from "vant";
export default {
  components: {
    Swipe,
    SwipeItem,
  },
  props: { dataList: Object, echarts: Object },
  mounted() {
    this.formatDataList();
  },
  watch: {
    dataList() {
      this.formatDataList();
    },
  },
  data() {
    return {
      electricData: [],
      waterData: [],
      WQQSK1Data: [],
      WQQSK2Data: [],
    };
  },
  methods: {
    formatDataList() {
      this.electricData = [];
      this.waterData = [];
      this.WQQSK1Data = [];
      this.WQQSK2Data = [];
      for (let index in this.dataList) {
        let list = [];
        list[0] = this.dataList[index].time.substring(5, 17);
        list[1] = this.dataList[index].electricConsumption;
        this.electricData.push(list);
      }
      for (let index in this.dataList) {
        let list = [];
        list[0] = this.dataList[index].time.substring(5, 17);
        list[1] = this.dataList[index].exFactoryWaterFlow;
        this.waterData.push(list);
      }
      for (let index in this.dataList) {
        let list = [];
        list[0] = this.dataList[index].time.substring(5, 17);
        list[1] = this.dataList[index].waterLevelWQQSK1;
        this.WQQSK1Data.push(list);
      }
      for (let index in this.dataList) {
        let list = [];
        list[0] = this.dataList[index].time.substring(5, 17);
        list[1] = this.dataList[index].waterLevelWQQSK2;
        this.WQQSK2Data.push(list);
      }
      this.drawLine("line1", "耗电量", "kw.h", this.electricData);
      this.drawLine("line2", "出厂水流量", "m³", this.waterData);
      this.drawLine("line3", "温泉厂内清水库水位", "m³", this.WQQSK1Data);
      this.drawLine("line4", "温泉厂外清水库水位", "m³", this.WQQSK2Data);
    },
    drawLine(dom, text, formatter, data) {
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
            data: data,
          },
        ],
      };
      myChart.setOption(option);
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
.my-swipe {
  padding-bottom: 5vh;
}
.van-swipe__indicator {
  background: black;
}
</style>
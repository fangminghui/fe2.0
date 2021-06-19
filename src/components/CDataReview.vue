<template>
  <div id="ccllArray" class="line_chart" v-show="!this.dataList.isYpl"></div>
  <div id="ydlArray" class="line_chart" v-show="!this.dataList.isYpl"></div>
  <div v-show="!this.dataList.isYpl">
    <swipe class="my-swipe">
      <swipe-item v-for="(item,index) in this.swArray" :key="index">
        <div :id="'swArray'+index" class="line_chart"></div>
      </swipe-item>
    </swipe>
  </div>
  <div v-show="this.dataList.isYpl">
    <div v-for="(item,index) in this.swArray" :key="index" :id="'swArray-'+index" class="line_chart"></div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "vant";

export default {
  components: {
    Swipe,
    SwipeItem,
  },
  props: {
    dataList: {},
    echarts: Object,
  },
  mounted() {
    this.formatDataList();
  },
  data() {
    return { ccllArray: [], ydlArray: [], swArray: [] };
  },
  watch: {
    dataList() {
      this.formatDataList();
    },
  },
  methods: {
    formatDataList() {
      if (!this.dataList.isYpl) {
        this.ccllArray = [];
        for (let index in this.dataList.ccllArray) {
          let list = [];
          list[0] = this.dataList.timeArray[index];
          list[1] = this.dataList.ccllArray[index];
          this.ccllArray.push(list);
        }
        this.ydlArray = [];
        for (let index in this.dataList.ydlArray) {
          let list = [];
          list[0] = this.dataList.timeArray[index];
          list[1] = this.dataList.ydlArray[index];
          this.ydlArray.push(list);
        }
        if (!this.dataList.isWlq) {
          this.drawLine("ccllArray", "出厂水量", "m³", this.ccllArray);
          this.drawLine("ydlArray", "用电量", "kw.h", this.ydlArray);
        } else {
          this.drawLine("ccllArray", "取水泵站用电量", "kw.h", this.ccllArray);
          this.drawLine("ydlArray", "加压泵站用电量", "kw.h", this.ydlArray);
        }
      }
      this.swArray = [];
      for (let index in this.dataList.swArray) {
        this.swArray[index] = [];
        for (let index2 in this.dataList.swArray[index].value) {
          let list = [];
          list[0] = this.dataList.timeArray[index2];
          list[1] = this.dataList.swArray[index].value[index2];
          this.swArray[index].push(list);
        }
        if (!this.dataList.isYpl) {
          this.$nextTick(function () {
            this.drawLine("swArray" + index, this.dataList.swArray[index].name, "m", this.swArray[index]);
          });
        } else {
          this.$nextTick(function () {
            this.drawLine("swArray-" + index, this.dataList.swArray[index].name, "m³", this.swArray[index]);
          });
        }
      }
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
            start: 0,
            end: 100,
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

.van-swipe__indicator {
  background: black;
}
</style>
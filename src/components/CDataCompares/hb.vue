<template>
  <div v-for="(item, index) in resDesc" :key="index" :id="'line'+index" class="line_chart"></div>
</template>

<script>
export default {
  props: { dataList: Object, echarts: Object, resDesc: Object },
  mounted() {
    this.formatDataList();
  },
  data() {
    return {};
  },

  methods: {
    formatDataList() {
      let lastMonth = this.dataList.lastMonth;
      let thisMonth = this.dataList.thisMonth;
      for (let index2 in this.resDesc) {
        let position = this.resDesc[index2].value;
        let lastMonthData = [];
        let thisMonthData = [];
        if (position in lastMonth[0]) {
          for (let index in lastMonth) {
            let list = [];
            list[0] = lastMonth[index].date;
            list[1] = lastMonth[index][position];
            lastMonthData.push(list);
          }
          for (let index in thisMonth) {
            let list = [];
            list[0] = thisMonth[index].date;
            list[1] = thisMonth[index][position];
            thisMonthData.push(list);
          }
        }
        this.drawLine("line" + index2, this.resDesc[index2].desc, lastMonthData, thisMonthData);
      }
    },
    drawLine(dom, text, lastMonthData, thisMonthData) {
      let formatter = "m³";
      if (lastMonthData.length === 0 && thisMonthData.length === 0) {
        let Dom = document.getElementById(dom);
        Dom.remove();
      } else {
        if (text.indexOf("电量") !== -1) {
          formatter = "kW·h";
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
          },
          yAxis: [
            {
              type: "value",
              axisLabel: {
                formatter: "{value} " + formatter,
              },
            },
          ],
          legend: {
            top: "8%",
            data: ["上月", "本月"],
          },
          grid: [
            {
              left: 90,
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
              name: "上月",
              type: "line",
              symbol: "none",
              data: lastMonthData,
            },
            {
              name: "本月",
              type: "line",
              symbol: "none",
              data: thisMonthData,
            },
          ],
        };
        myChart.setOption(option);
      }
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
</style>
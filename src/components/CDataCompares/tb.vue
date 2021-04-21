<template>
  <div v-for="(item, index) in resDesc" :key="index" :id="'line'+index" class="line_chart"></div>
</template>

<script>
export default {
  props: { dataList: Object, echarts: Object, resDesc: Object, years: String },
  mounted() {
    this.formatDataList();
  },
  data() {
    return { yearsList: this.years.split(",") };
  },

  methods: {
    formatDataList() {
      for (let index in this.resDesc) {
        let position = this.resDesc[index].value;
        let yearsData = [];
        if (position in this.dataList[Object.keys(this.dataList)[0]][0]) {
          for (let year of this.yearsList) {
            let data1 = [];
            let dataList2 = this.dataList[year];
            for (let index2 in dataList2) {
              let list = [];
              list[0] = dataList2[index2].date;
              list[1] = dataList2[index2][position];
              data1.push(list);
            }
            yearsData.push(data1);
          }
        }
        this.drawLine("line" + index, this.resDesc[index].desc, yearsData);
      }
    },
    drawLine(dom, text, yearsData) {
      let formatter = "m³";
      let series = [];
      for (let index in this.yearsList) {
        series.push({
          name: this.yearsList[index],
          type: "line",
          symbol: "none",
          data: yearsData[index],
        });
      }
      if (yearsData.length === 0) {
        let Dom = document.getElementById(dom);
        Dom.remove();
      } else {
        if (text.indexOf("电量") !== -1) {
          formatter = "kW·h";
        } else if (text.indexOf("水位") !== -1) {
          formatter = "m";
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
            data: this.yearsList,
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
          series: series,
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
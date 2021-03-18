<template>
  <div :id="deviceCode" class="line_chart"></div>
</template>

<script>
export default {
  props: {
    deviceCode: String,
    openId: String,
    authorization: String,
    echarts: Object,
    deviceName: String,
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    async getData() {
      await this.axios({
        method: "get",
        url: "/open/openapi/read/record/" + this.openId + "/" + this.deviceCode,
        headers: { Authorization: "Bearer " + this.authorization },
        params: {
          current: 1,
          size: 50,
          startTime: "2021-01-01 00:00:00",
          endTime: "2021-05-01 23:59:59",
        },
      }).then((res) => {
        let data = res.data.data.records;
        for (let index in data) {
          let list = [];
          list[0] = data[index].deviceClock.substring(5, 17);
          list[1] = data[index].deviceCurrentData;
          this.dataList.push(list);
        }
        this.drawLine(this.dataList);
      });
    },
    drawLine(data) {
      let myChart = this.echarts.init(document.getElementById(this.deviceCode));
      let option = {
        title: {
          text: this.deviceName,
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
              formatter: "{value} " + "m³",
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
            start: 70,
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
  height: 35vh;
  padding-top: 2vh;
}

.van-swipe__indicator {
  background: black;
}
</style>
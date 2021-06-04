<template>
  <div class="background">
    <c-select-bar :selection="selection" @select="select" :date-time-type="dateTimeType" />
    <c-data-review :dataList="dataList" :echarts="echarts"></c-data-review>
  </div>
</template>

<script>
import CSelectBar from "../components/CSelectBar.vue";
import publicFunc from "../publicFunc";
import CDataReview from "../components/CDataReview.vue";
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent, DataZoomComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, LineChart, TitleComponent, CanvasRenderer, TooltipComponent, DataZoomComponent]);
export default {
  components: {
    CSelectBar,
    CDataReview,
  },
  created() {
    this.para.startTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 8)));
    this.para.endTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 1)));
    this.getData();
    this.getAreaValue();
  },
  mounted() {},
  data() {
    return {
      echarts: echarts,
      dataList: {},
      selection: [
        {
          title: "统计区域",
          kind: "select",
          content: "",
          options: [],
        },
        {
          title: "时间间隔",
          kind: "select",
          content: "",
          options: [
            {
              value: 1,
              text: "天",
            },
            {
              value: 2,
              text: "小时",
            },
            {
              value: 3,
              text: "分钟",
            },
          ],
        },
        {
          title: "统计时间",
          kind: "time",
          content: "",
        },
      ], //下拉框标题和内容
      para: {
        timeType: 1,
        area: "th",
        startTime: "",
        endTime: "",
      },
      dateTimeType: "date",
    };
  },
  methods: {
    async getAreaValue() {
      this.selection[0].options = [];
      await this.axios.get("/api/history/areaDesc").then((res) => {
        for (let area of res.data.data) {
          let option = {
            value: area.key,
            text: area.name,
          };
          this.selection[0].options.push(option);
        }
      });
    },
    getData() {
      this.$emit("loading");
      this.axios({
        method: "post",
        url: "api/historyData",
        data: this.para,
      }).then((response) => {
        this.dataList = response.data.data;
        this.$emit("finish");
      });
    },
    select(title, content) {
      if (title === "统计区域") {
        this.para.area = content.value;
        this.getData();
      } else if (title === "时间间隔") {
        this.para.timeType = content.value;
        let typeList = ["date", "datehour", "datetime"];
        this.dateTimeType = typeList[content.value - 1];
      } else if (title === "统计时间") {
        if (content && content[0] !== "开") {
          this.para.startTime = publicFunc.format(content.split("?")[0]);
          this.para.endTime = publicFunc.format(content.split("?")[1]);
        } else {
          this.para.startTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 8)));
          this.para.endTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 1)));
        }
        this.getData();
      }
    }, //根据选择处理数据
  },
};
</script>

<style scoped>
.background {
  min-height: 100vh;
  width: 100vw;
  background: #f6f6f6;
  padding-bottom: 2vh;
  box-sizing: border-box;
}
</style>
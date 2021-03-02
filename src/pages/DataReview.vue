<template>
  <div class="background">
    <c-select-bar :selection="selection" @select="select" :date-time-type="dateTimeType" />
    <keep-alive>
      <component :is="para.area" :dataList="dataList" :echarts="echarts"></component>
    </keep-alive>
  </div>
</template>

<script>
import CSelectBar from "../components/CSelectBar.vue";
import th from "../components/CDataReviews/th.vue";
import xh from "../components/CDataReviews/xh.vue";
import ygs from "../components/CDataReviews/ygs.vue";
import wq from "../components/CDataReviews/wq.vue";
import publicFunc from "../publicFunc";
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent, DataZoomComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, LineChart, TitleComponent, CanvasRenderer, TooltipComponent, DataZoomComponent]);
export default {
  components: {
    CSelectBar,
    th,
    xh,
    ygs,
    wq,
  },
  created() {
    this.para.startTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 8)));
    this.para.endTime = publicFunc.format(new Date(new Date().setDate(new Date().getDate() - 1)));
    this.getData();
  },
  mounted() {},
  data() {
    return {
      echarts: echarts,
      dataList: [],
      selection: [
        {
          title: "统计区域",
          kind: "select",
          content: "",
          options: [
            {
              value: "th",
              text: "天海",
            },
            {
              value: "xh",
              text: "西海",
            },
            {
              value: "ygs",
              text: "云谷寺",
            },
            {
              value: "wq",
              text: "温泉",
            },
          ],
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
    getData() {
      this.$emit("loading");
      this.axios({
        method: "post",
        url: "api/historyData",
        data: this.para,
      }).then((response) => {
        this.dataList = [].concat(response.data.data);
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
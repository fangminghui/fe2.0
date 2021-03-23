<template>
  <div class="background">
    <c-select-bar v-if="selection" :selection="selection" @select="select" />
    <hb v-if="show===1" :dataList="dataList" :resDesc="resDesc" :echarts="echarts" />
    <tb v-if="show===2" :dataList="dataList" :resDesc="resDesc" :echarts="echarts" :years="years" />
  </div>
</template>

<script>
import CSelectBar from "../components/CSelectBar.vue";
import Hb from "../components/CDataCompares/hb.vue";
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
import Tb from "../components/CDataCompares/tb.vue";
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
  components: {
    CSelectBar,
    Hb,
    Tb,
  },
  created() {
    this.getAreaValue();
    this.getData();
  },
  mounted() {},
  data() {
    return {
      echarts: echarts,
      dataList: [],
      resDesc: [],
      selection: [
        {
          title: "统计区域",
          kind: "select",
          content: "",
          options: [],
        },
        {
          title: "对比方式",
          kind: "select",
          content: "",
          options: [
            {
              value: "tb",
              text: "同比",
            },
            {
              value: "hb",
              text: "环比",
            },
          ],
        },
        {
          title: "对比时间",
          kind: "selects",
          content: "",
          options: [],
        },
      ], //下拉框标题和内容
      area: "wlq",
      tbORhb: "hb",
      years: "",
      show: 0, //0不显示，1显示环比，2显示同比
    };
  },
  methods: {
    async getAreaValue() {
      this.selection[0].options = [];
      await this.axios.get("/api/data/areaDesc").then((res) => {
        for (let area of res.data.data) {
          let option = {
            value: area.value,
            text: area.desc,
          };
          this.selection[0].options.push(option);
        }
      });
    },
    async getData() {
      this.$emit("loading");
      this.dataList = await this.getHBData();
      this.resDesc = await this.getResDesc();
      this.show = 1;
      this.$emit("finish");
    },
    async getHBData() {
      let res = await this.axios.get("api/data/hb?area=" + this.area);
      return res.data.data;
    },
    async getTBData() {
      let res = await this.axios.get("api/data/tb?area=" + this.area + "&years=" + this.years);
      return res.data.data;
    },
    async getResDesc() {
      let res = await this.axios.get("api/data/resDesc?area=" + this.area);
      return res.data.data;
    },
    async select(title, content) {
      if (title === "统计区域") {
        this.area = content.value;
        this.$emit("loading");
        this.show = 0;
        if (this.tbORhb === "hb") {
          this.dataList = await this.getHBData();
          this.resDesc = await this.getResDesc();
          this.show = 1;
        } else {
          this.dataList = await this.getTBData();
          this.resDesc = await this.getResDesc();
          this.show = 2;
        }
        this.$emit("finish");
      }
      if (title === "对比方式") {
        this.tbORhb = content.value;
        if (content.value === "hb") {
          this.selection[2].options = [];
        } else {
          this.selection[2].options = this.setYears();
        }
      }
      if (title === "对比时间") {
        this.years = content.join(",");
        this.$emit("loading");
        this.show = 0;
        this.dataList = await this.getTBData();
        this.resDesc = await this.getResDesc();
        this.show = 2;
        this.$emit("finish");
      }
    },
    setYears() {
      let options = [];
      let myDate = new Date();
      let year = parseInt(myDate.getFullYear());
      for (let index = 2013; index <= year; index++) {
        options.push({
          value: index,
          text: index,
        });
      }
      return options;
    },
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
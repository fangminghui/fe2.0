<template>
  <div>
    <div class="back"></div>
    <field
      v-model="fieldValue"
      input-align="right"
      is-link
      readonly
      label="管线名称"
      placeholder="请选择管线名"
      @click="show = true"
      size="large"
      style="z-index:2;position:relative;"
    />
    <popup v-model:show="show" round position="bottom">
      <loading class="addressLoading" v-if="loading" size="40px" color="#1989fa">加载中...</loading>
      <cascader
        v-model="cascaderValue"
        title="请选择管线名"
        :options="options"
        @change="change"
        @close="show = false"
        @finish="onFinish"
      />
    </popup>
    <div v-if="noDataImg" class="nodata">
      <img src="../assets/svg/noData.svg" class="noDataImg" />
      <div>暂无数据</div>
    </div>
    <all-line v-if="allLine" @finish="finish" @nodata="nodata" />
    <one-line v-if="oneLine" :lineId="lineId" @finish="finish" @nodata="nodata" />
  </div>
</template>

<script>
import { Field, Popup, Cascader, loading } from "vant";
import AllLine from "./AllLine.vue";
import OneLine from "./OneLine.vue";
export default {
  components: {
    Cascader,
    Field,
    Popup,
    loading,
    OneLine,
    AllLine,
  },
  created() {
    this.getOptions();
  },
  data() {
    return {
      show: true,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
      loading: true,
      allLine: false,
      oneLine: false,
      noDataImg: false,
      lineId: 0,
    };
  },
  methods: {
    async getOptions() {
      this.options = [];
      let pipelines;
      await this.axios.get("api/gis/pipe/list").then((response) => {
        pipelines = response.data.data;
      });
      let allLine = {
        text: "所有管线",
        value: "all",
      };
      this.options.push(allLine);
      for (let pipeline of pipelines) {
        let obj = {
          text: pipeline.name,
          value: pipeline.id,
        };
        this.options.push(obj);
      }
      this.loading = false;
    },
    onFinish({ selectedOptions, value }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      let first = this.allLine || this.oneLine;
      if (value === "all") {
        this.allLine = true;
        this.oneLine = false;
      } else {
        this.allLine = false;
        this.oneLine = true;
        this.lineId = value;
      }
      if (!first) {
        this.$emit("loading");
      }
    },
    finish() {
      this.$emit("finish");
      this.noDataImg = false;
      this.getOptions();
    },
    nodata() {
      this.$emit("finish");
      this.noDataImg = true;
      this.getOptions();
    },
  },
};
</script>

<style>
.van-swipe__track {
  height: 30vh;
}
.van-swipe {
  overflow: auto;
}
.van-cascader__options {
  height: 100%;
}
.addressLoading {
  position: absolute;
  width: 100%;
  height: 70%;
  margin-top: 30%;
  background: white;
  z-index: 2007;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nodata {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  background-color: #f3f3f3;
}
.back {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  background-color: #f3f3f3;
  z-index: -1;
}
.noDataImg {
  width: 30vw;
  margin-bottom: 5vw;
}
.van-field {
  background-color: #f3f3f3;
  border-bottom: 0.1vw solid black;
}
.van-cell::after {
  border-bottom: 0;
}
</style>
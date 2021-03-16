<template>
  <div>
    <field
      v-model="fieldValue"
      input-align="right"
      is-link
      readonly
      label="监测区域"
      placeholder="请选择监测区域"
      @click="show = true"
      size="large"
      style="z-index:2;position:relative;"
    />
    <popup v-model:show="show" round position="bottom">
      <loading class="addressLoading" v-if="loading" size="40px" color="#1989fa">加载中...</loading>
      <cascader
        v-model="cascaderValue"
        title="请选择监测区域"
        :options="options"
        @change="change"
        @close="show = false"
        @finish="onFinish"
      />
    </popup>
    <monitor-public-page v-if="selection!==0" :id="selection" @finish="finish" @nodata="nodata" />
    <monitor-water v-if="waterComp" @finish="finish" @nodata="nodata"></monitor-water>
    <div v-if="noDataImg" class="nodata">
      <img src="../assets/svg/noData.svg" class="noDataImg" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { Field, Popup, Cascader, loading } from "vant";
import MonitorPublicPage from "./MonitorPublicPage.vue";
import MonitorWater from "./MonitorWater.vue";
import axios from "axios";
export default {
  components: {
    Cascader,
    Field,
    Popup,
    loading,
    MonitorPublicPage,
    MonitorWater,
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
      selection: 0,
      noDataImg: false,
      waterComp: false,
    };
  },
  methods: {
    async getOptions() {
      let response = await axios.get("/api/equipment/list_grade1");
      response = response.data.data;
      let waterOption = {
        text: "水位参数",
        value: "water",
      };
      this.options.push(waterOption);
      for (let item of response) {
        let obj = {
          text: item.deviceName,
          value: item.id,
        };
        this.options.push(obj);
      }
      this.loading = false;
    },
    onFinish({ selectedOptions, value }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      if (value === "water") {
        this.waterComp = true;
        this.selection = 0;
      } else {
        this.waterComp = false;
        this.selection = value;
      }
      this.$emit("loading");
    },
    finish() {
      this.$emit("finish");
      this.noDataImg = false;
    },
    nodata() {
      this.$emit("finish");
      this.noDataImg = true;
      this.waterComp = false;
      this.selection = 0;
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
  height: 80vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.noDataImg {
  width: 30vw;
  margin-bottom: 5vw;
}
</style>
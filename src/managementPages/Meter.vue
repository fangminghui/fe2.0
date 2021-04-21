<template>
  <list :finished="true" finished-text="没有更多了">
    <cell>
      <div class="waterCell">
        <div style="color:#323233;">序号</div>
        <div>表号</div>
        <div>累计流量</div>
      </div>
    </cell>
    <collapse v-model="activeNames">
      <collapse-item v-for="(item,index) in dataList" :key="index">
        <template #title>
          <div class="waterCell">
            <div>{{index+1}}</div>
            <div>{{item.deviceName}}</div>
            <div>{{item.deviceTotalData}}m³</div>
          </div>
        </template>
        <c-meter
          :deviceCode="item.deviceCode"
          :deviceName="item.deviceName"
          :openId="openId"
          :authorization="authorization"
          :echarts="echarts"
        />
      </collapse-item>
    </collapse>
  </list>
</template>
<script>
import { List, Cell, Collapse, CollapseItem } from "vant";
import CMeter from "../components/CMeter";
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent, DataZoomComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, LineChart, TitleComponent, CanvasRenderer, TooltipComponent, DataZoomComponent]);
export default {
  components: {
    List,
    Cell,
    Collapse,
    CollapseItem,
    CMeter,
  },
  created() {
    this.getAuth();
    this.$emit("loading");
  },
  data() {
    return {
      echarts: echarts,
      dataList: [],
      authorization: "",
      current: 1,
      activeNames: ["0"],
      openId: "8cf4b206b02c4267978c492edd061a4a",
    };
  },
  methods: {
    async getAuth() {
      await this.axios({
        method: "post",
        url: "/auth/oauth/token?grant_type=client_credentials&scope=open",
        headers: { Authorization: "Basic b3BlbmNsaWVudDpvcGVuY2xpZW50" },
      }).then((res) => {
        this.authorization = res.data.access_token;
        this.getData();
      });
    }, //获取认证
    async getData() {
      await this.axios({
        method: "get",
        url: "/open/openapi/read/info/page/" + this.openId,
        headers: { Authorization: "Bearer " + this.authorization },
        params: {
          current: this.current,
          size: 100,
        },
      }).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.dataList = data;
          this.getName();
        } else {
          this.$emit("nodata");
        }
      });
    },
    getName() {
      let length = this.dataList.length;
      for (let index = 0; index < length; index++) {
        this.axios
          .get("api/equipment/list?pageNum=1&pageSize=1&deviceNumber=" + this.dataList[index].deviceCode)
          .then((res) => {
            if (res.data.data.resultList.length > 0) {
              this.dataList[index].deviceName = res.data.data.resultList[0].deviceName;
            } else {
              this.dataList[index].deviceName = this.dataList[index].deviceCode;
            }
            if (index === length - 1) {
              this.$emit("finish");
            }
          });
      }
    },
  },
};
</script>

<style scoped>
.waterCell {
  display: flex;
  font-size: 4vw;
}
.waterCell > div:first-child {
  flex: 1;
  display: flex;
  justify-content: center;
  color: #1296db;
}
.waterCell > div {
  flex: 2;
  display: flex;
  justify-content: center;
}
</style>
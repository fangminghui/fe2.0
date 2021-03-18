<template>
  <list :finished="true" finished-text="没有更多了">
    <cell>
      <div class="waterCell">
        <div style="color:#323233;">序号</div>
        <div>表号</div>
        <div>累计流量</div>
      </div>
    </cell>
    <cell v-for="(item,index) in dataList" :key="index">
      <div class="waterCell">
        <div>{{index+1}}</div>
        <div>{{item.deviceCode}}</div>
        <div>{{item.deviceTotalData}}m³</div>
      </div>
    </cell>
  </list>
</template>
<script>
import { List, Cell } from "vant";
export default {
  components: {
    List,
    Cell,
  },
  created() {
    this.getAuth();
  },
  data() {
    return {
      dataList: [],
      authorization: "",
      current: 1,
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
        url: "/open/openapi/read/info/page/8cf4b206b02c4267978c492edd061a4a",
        headers: { Authorization: "Bearer " + this.authorization },
        params: {
          current: this.current,
          size: 100,
        },
      }).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.dataList = data;
          this.$emit("finish");
        } else {
          this.$emit("nodata");
        }
      });
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
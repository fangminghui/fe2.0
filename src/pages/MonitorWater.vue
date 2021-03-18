<template>
  <list :finished="true" finished-text="没有更多了">
    <cell v-for="(item,index) in dataList" :key="index">
      <div class="waterCell">
        <div>{{item.device_name}}</div>
        <div>{{item.plcData.value}}&nbsp;{{item.plcData.unit}}</div>
      </div>
    </cell>
  </list>
</template>
<script>
import { List, cell } from "vant";
import publicFunc from "../publicFunc";
export default {
  components: {
    List,
    cell,
  },
  created() {
    this.getData();
    setInterval(this.reFresh, 5000); //指定5秒刷新一次
  },
  data() {
    return {
      dataList: [],
      api: "/api/lss/waterLevel",
      para: "",
    };
  },
  methods: {
    async getData() {
      this.dataList = [];
      let result = await publicFunc.getData(this.api, this.para, 0);
      this.$emit("finish");
      if (result.length > 0) {
        this.dataList = result;
      } else {
        this.$emit("nodata");
      }
    }, //获取数据
    async reFresh() {
      let result = await publicFunc.getData(this.api, this.para, 0);
      if (result.length > 0) {
        this.dataList = result;
      }
    },
  },
};
</script>

<style scoped>
.waterCell {
  display: flex;
  justify-content: space-between;
  padding: 0 8vw;
  font-size: 4vw;
}
</style>
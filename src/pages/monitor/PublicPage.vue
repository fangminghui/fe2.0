<template>
  <list
    v-model:loading="loading"
    :finished="finished"
    :immediate-check="false"
    :offset="10"
    finished-text="没有更多了"
    @load="getMore"
  >
    <c-monitor v-for="(cmonitor, index) in dataList" :key="index" :cmonitor="cmonitor" />
  </list>
</template>
<script>
import { List } from "vant";
import publicFunc from "../../publicFunc";
import CMonitor from "../../components/CMonitor.vue";
export default {
  components: {
    List,
    CMonitor,
  },
  props: {
    id: Number,
  },
  created() {
    this.getData();
    setInterval(this.reFresh, 5000); //指定5秒刷新一次
  },
  data() {
    return {
      dataList: [],
      loading: false,
      finished: false,
      para: {
        pageNum: 1,
        pageSize: 5,
        id: this.id,
      },
      api: "/api/equipment/list_child_plc",
    };
  },
  methods: {
    async getData() {
      this.dataList = [];
      this.finished = false;
      this.loading = true;
      this.$emit("loading");
      this.para.pageNum = 1;
      let result = await publicFunc.getData(this.api, this.para, 0);
      this.refreshing = false;
      this.$emit("finish");
      if (result.length > 0) {
        this.para.pageNum++;
        this.dataList = result;
      } else {
        this.$emit("noData");
      }
      this.loading = false;
    }, //获取数据
    getMore() {
      setTimeout(async () => {
        let result = await publicFunc.getData(this.api, this.para, 0);
        if (result.length > 0) {
          this.para.pageNum++;
          this.dataList = this.dataList.concat(result);
        } else {
          this.finished = true;
        }
        this.loading = false;
      }, 1000);
    }, //加载更多
    async reFresh() {
      let para = {
        pageNum: 1,
        pageSize: "",
        id: this.id,
      };
      para.pageSize = (this.para.pageNum - 1) * this.para.pageSize;
      let result = await publicFunc.getData(this.api, para, 0);
      if (result.length > 0) {
        this.dataList = result;
      }
    },
  },
};
</script>

<style scoped>
.refresh {
  width: 100vw;
  min-height: 100vh;
}
</style>
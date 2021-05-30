<template>
  <c-select-bar v-if="selection" :selection="selection" class="selectbar" @select="select" />
  <pull-refresh v-model="refreshing" @refresh="getData" class="refresh">
    <list
      v-model:loading="loading"
      :finished="finished"
      :immediate-check="false"
      :offset="10"
      finished-text="没有更多了"
      @load="getMore"
    >
      <c-warning-message
        v-for="(warningMessage) in dataList"
        :key="warningMessage.id"
        :warningMessage="warningMessage"
        class="CWarningMessage"
        @confirm="confirm"
      />
    </list>
  </pull-refresh>
</template>

<script>
import { List, PullRefresh, Toast } from "vant";
import CWarningMessage from "../components/CWarningMessage";
import publicFunc from "../publicFunc";
import CSelectBar from "../components/CSelectBar";
import axios from "axios";
export default {
  components: {
    List,
    PullRefresh,
    CWarningMessage,
    CSelectBar,
  },
  created() {
    this.getData();
  },
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      dataList: [],
      selection: [
        {
          title: "报警设备",
          kind: "search",
          content: "输入报警设备",
        },
        {
          title: "报警类型",
          kind: "select",
          content: "",
          options: [
            {
              value: "",
              text: "全部",
            },
            {
              value: 0,
              text: "警告",
            },
            {
              value: 1,
              text: "报警",
            },
            {
              value: 2,
              text: "事故",
            },
          ],
        },
        {
          title: "发生时间",
          kind: "time",
          content: "",
          startTime: "开始时间",
          endTime: "结束时间",
        },
      ], //下拉框标题和内容
      para: {
        pageNum: 1,
        pageSize: 10,
        alarmDevice: "",
        type: "",
        startTime: "",
        endTime: "",
      },
      api: "api/warning/list",
    };
  },
  methods: {
    async getData() {
      this.dataList = [];
      this.finished = false;
      this.loading = true;
      this.$emit("loading");
      this.para.pageNum = 1;
      let result = await publicFunc.getData(this.api, this.para);
      this.refreshing = false;
      this.$emit("finish");
      if (result.length > 0) {
        this.para.pageNum++;
        this.dataList = result;
      } else {
        this.$emit("nodata");
      }
      this.loading = false;
    }, //获取数据
    getMore() {
      setTimeout(async () => {
        let result = await publicFunc.getData(this.api, this.para);
        if (result.length > 0) {
          this.para.pageNum++;
          this.dataList = this.dataList.concat(result);
        } else {
          this.finished = true;
        }
        this.loading = false;
      }, 500);
    }, //加载更多
    select(title, content) {
      if (title === "报警设备") {
        this.para.alarmDevice = content;
        this.getData();
      } else if (title === "报警类型") {
        this.para.type = content.value;
        this.getData();
      } else if (title === "发生时间") {
        this.para.startTime = publicFunc.format(content.split("?")[0]);
        this.para.endTime = publicFunc.format(content.split("?")[1]);
        this.getData();
      }
    }, //根据选择处理数据
    confirm(id) {
      axios
        .post(`/api/warning/confirm?warningId=${id}`)
        .then((res) => {
          if (res.data.message === "操作成功") {
            this.dataList = this.dataList.filter((e) => e.id !== id);
            Toast.success("操作成功");
          } else {
            Toast.fail("操作失败");
          }
        })
        .catch(() => {
          Toast.fail("操作失败");
        });
      // let newDataList = [].concat(this.dataList);
      // let messsage = newDataList.find((e) => e.id === id);
      // messsage.confirmStatus = 1;
      // newDataList = newDataList.filter((e) => e.id !== id);
      // newDataList.push(messsage);
      // this.dataList = newDataList;
    },
  },
};
</script>

<style scoped>
.refresh {
  width: 100vw;
}
.selectbar {
  width: 100vw;
}
</style>
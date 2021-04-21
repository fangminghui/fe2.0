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
      <c-user-management v-for="(User, index) in dataList" :key="index" :User="User" class="CUserManagement" />
    </list>
  </pull-refresh>
</template>
<script>
import CSelectBar from "../components/CSelectBar";
import publicFunc from "../publicFunc";
import CUserManagement from "../components/CUserManagement.vue";
import { List, PullRefresh } from "vant";

export default {
  components: {
    CUserManagement,
    CSelectBar,
    List,
    PullRefresh,
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
          title: "用户名",
          kind: "search",
          content: "输入用户名",
        },
        {
          title: "真实姓名",
          kind: "search",
          content: "输入真实姓名",
        },
        {
          title: "性别",
          kind: "select",
          content: "",
          options: [
            {
              value: "0",
              text: "男",
            },
            {
              value: "1",
              text: "女",
            },
          ],
        },
      ], //下拉框标题和内容
      para: {
        pageNum: 1,
        pageSize: 20,
        loginName: "",
        sex: "",
        username: "",
      },
      api: "api/user/list",
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
      if (title === "用户名") {
        this.para.loginName = content;
        this.getData();
      } else if (title === "真实姓名") {
        this.para.username = content;
        this.getData();
      } else if (title === "性别") {
        console.log(content);
        this.para.sex = content.value;
        this.getData();
      }
    }, //根据选择处理数据
  },
};
</script>

<style scoped>
.CUserManagement {
  width: 100%;
}
</style>
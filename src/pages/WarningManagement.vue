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
      <c-warning-management
        v-for="(WarningManagement, index) in dataList"
        :key="WarningManagement.id"
        :index="index"
        :WarningManagement="WarningManagement"
        @delete-ele="deleteEle"
        @change-ele="changeEle"
        class="WarningManagement"
      />
    </list>
  </pull-refresh>
  <c-confirm v-show="showDelete" :content="'确定要删除吗？'" @cancel="deleteCancel" @confirm="deleteConfirm" />
  <c-form v-if="showChange" :title="'修改'" :formData="formData" @cancel="changeCancel" @confirm="changeConfirm" />
  <div class="addButton" @click="addEle">+</div>
  <c-form v-if="showAdd" :title="'添加'" :formData="formData" @cancel="addCancel" @confirm="addConfirm" />
</template>
<script>
import CWarningManagement from "../components/CWarningManagement";
import publicFunc from "../publicFunc";
import qs from "qs";
import CConfirm from "../components/CConfirm.vue";
import CForm from "../components/CForm.vue";
import { Toast } from "vant";
import { List, PullRefresh } from "vant";
import CSelectBar from "../components/CSelectBar";

export default {
  components: {
    CWarningManagement,
    CConfirm,
    CForm,
    List,
    PullRefresh,
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
          title: "报警类型",
          kind: "select",
          content: ["全部", "警告", "报警", "事故"],
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
          title: "设备编号",
          kind: "search",
          content: "输入设备编号",
        },
        {
          title: "报警地点",
          kind: "search",
          content: "输入报警地点",
        },
      ],
      para: {
        pageNum: 1,
        pageSize: 20,
        deviceId: "",
        site: "",
        typeName: "",
      },
      showDelete: false,
      showChange: false,
      showAdd: false,
      dataIndex: -1,
      formData: [
        {
          title: "报警类型",
          kind: "select",
          placeholder: ["警告", "报警", "事故"],
          content: "",
        },
        {
          title: "设备编号",
          kind: "search",
          placeholder: "输入设备编号",
          content: "",
        },
        {
          title: "数据字段",
          kind: "search",
          placeholder: "输入数据字段",
          content: "",
        },
        {
          title: "报警地点",
          kind: "search",
          placeholder: "输入报警地点",
          content: "",
        },
        {
          title: "报警内容",
          kind: "search",
          placeholder: "输入报警内容",
          content: "",
        },
        {
          title: "上临界点",
          kind: "search",
          placeholder: "输入上临界点",
          content: "",
        },
        {
          title: "下临界点",
          kind: "search",
          placeholder: "输入下临界点",
          content: "",
        },
      ],
      api: "api/warningType/list",
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
      if (title === "报警类型") {
        this.para.typeName = content.text;
        this.getData();
      } else if (title === "设备编号") {
        this.para.deviceId = content;
        this.getData();
      } else if (title === "报警地点") {
        this.para.site = content;
        this.getData();
      }
    }, //根据选择处理数据
    deleteEle(index) {
      this.dataIndex = index;
      this.showDelete = true;
    },
    deleteCancel() {
      this.showDelete = false;
    },
    deleteConfirm() {
      this.axios
        .post("/api/warningType/delete", qs.stringify({ id: this.dataList[this.dataIndex].id }))
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("删除成功");
            this.showDelete = false;
            this.dataList.splice(this.dataIndex, 1);
          }
        });
    },
    changeEle(obj, index) {
      this.dataIndex = index;
      this.formData[0].content = obj.typeName;
      this.formData[1].content = obj.deviceId;
      this.formData[2].content = obj.fieldName;
      this.formData[3].content = obj.site;
      this.formData[4].content = obj.content;
      this.formData[5].content = obj.highAlarmSetting;
      this.formData[6].content = obj.lowAlarmSetting;
      this.showChange = true;
    },
    changeCancel() {
      for (let i = 0; i < 7; i++) {
        this.formData[i].content = "";
      }
      this.showChange = false;
    },
    changeConfirm(formDataCopy) {
      let index = this.dataIndex;
      let wm = this.dataList.slice();
      wm[index].typeName = formDataCopy[0].content;
      wm[index].deviceId = formDataCopy[1].content;
      wm[index].fieldName = formDataCopy[2].content;
      wm[index].site = formDataCopy[3].content;
      wm[index].content = formDataCopy[4].content;
      wm[index].highAlarmSetting = formDataCopy[5].content;
      wm[index].lowAlarmSetting = formDataCopy[6].content;
      this.axios.post("/api/warningType/updateInfo", wm[index]).then((response) => {
        if (response.data.code === 200) {
          Toast.success("修改成功");
          this.dataList = [].concat(wm);
          this.showChange = false;
          for (let i = 0; i < 7; i++) {
            this.formData[i].content = "";
          }
        }
      });
    },
    addEle() {
      this.showAdd = true;
    },
    addCancel() {
      this.showAdd = false;
    },
    addConfirm(formDataCopy) {
      let wm = {};
      wm.typeName = formDataCopy[0].content;
      wm.deviceId = formDataCopy[1].content;
      wm.fieldName = formDataCopy[2].content;
      wm.site = formDataCopy[3].content;
      wm.content = formDataCopy[4].content;
      wm.highAlarmSetting = formDataCopy[5].content;
      wm.lowAlarmSetting = formDataCopy[6].content;
      this.axios.post("/api/warningType/add", wm).then((response) => {
        if (response.data.code === 200) {
          Toast.success("添加成功");
          this.dataList = this.dataList.concat(wm);
          this.showAdd = false;
          for (let i = 0; i < 7; i++) {
            this.formData[i].content = "";
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.WarningManagement {
  width: 100%;
}
.addButton {
  position: fixed;
  right: 2vw;
  bottom: 15vh;
  width: 13vw;
  height: 13vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1296db;
  color: white;
  border-radius: 50%;
  font-size: 13vw;
  font-weight: 300;
}
</style>
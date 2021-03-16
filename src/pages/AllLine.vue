<template>
  <list
    v-model:loading="loading"
    :finished="finished"
    :immediate-check="false"
    :offset="10"
    finished-text="没有更多了"
    @load="getMore"
  >
    <c-line
      v-for="(pipeLine, index) in dataList"
      :key="pipeLine.id"
      :index="index"
      :pipeLine="pipeLine"
      @delete-ele="deleteEle"
      @change-ele="changeEle"
      class="pipeLine"
    />
  </list>
  <c-confirm v-show="showDelete" :content="'确定要删除吗？'" @cancel="deleteCancel" @confirm="deleteConfirm" />
  <c-form v-if="showChange" :title="'修改'" :formData="formData" @cancel="changeCancel" @confirm="changeConfirm" />
  <div class="addButton" @click="addEle">+</div>
  <c-form v-if="showAdd" :title="'添加'" :formData="formData" @cancel="addCancel" @confirm="addConfirm" />
</template>
<script>
import { List } from "vant";
import CLine from "../components/CLine";
import publicFunc from "../publicFunc";
import qs from "qs";
import CConfirm from "../components/CConfirm.vue";
import CForm from "../components/CForm.vue";
import { Toast } from "vant";
export default {
  components: {
    List,
    CLine,
    CConfirm,
    CForm,
  },
  created() {
    this.getData();
  },
  data() {
    return {
      loading: false,
      finished: false,
      dataList: [],
      api: "api/pipeline/list",
      para: {
        pageNum: 1,
        pageSize: 10,
      },
      showDelete: false,
      showChange: false,
      showAdd: false,
      dataIndex: -1,
      formData: [
        {
          title: "管线名",
          kind: "search",
          placeholder: "输入管线名",
          content: "",
        },
        {
          title: "长度",
          kind: "search",
          placeholder: "输入管线长度",
          content: "",
        },
        {
          title: "厂商",
          kind: "search",
          placeholder: "输入管线厂商",
          content: "",
        },
        {
          title: "管径",
          kind: "search",
          placeholder: "输入管线管径",
          content: "",
        },
        {
          title: "材质",
          kind: "search",
          placeholder: "输入管线材质",
          content: "",
        },
      ],
    };
  },
  methods: {
    async getData() {
      this.para.pageNum = 1;
      let result = await publicFunc.getData(this.api, this.para);
      if (result.length > 0) {
        this.para.pageNum++;
        this.dataList = result;
        this.$emit("finish");
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
    deleteEle(index) {
      this.dataIndex = index;
      this.showDelete = true;
    },
    deleteCancel() {
      this.showDelete = false;
    },
    deleteConfirm() {
      this.axios
        .post("/api/pipeline/delete", qs.stringify({ id: this.dataList[this.dataIndex].id }))
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("删除成功");
            this.getData();
            this.showDelete = false;
            this.dataList.splice(this.dataIndex, 1);
          }
        });
    },
    changeEle(obj, index) {
      this.dataIndex = index;
      this.formData[0].content = obj.name;
      this.formData[1].content = obj.length;
      this.formData[2].content = obj.manufacturer;
      this.formData[3].content = obj.pipeDiameter;
      this.formData[4].content = obj.texture;
      this.showChange = true;
    },
    changeCancel() {
      for (let i = 0; i < 5; i++) {
        this.formData[i].content = "";
      }
      this.showChange = false;
    },
    changeConfirm(formDataCopy) {
      let index = this.dataIndex;
      let pipeLines = this.dataList.slice();
      pipeLines[index].name = formDataCopy[0].content;
      pipeLines[index].length = formDataCopy[1].content;
      pipeLines[index].manufacturer = formDataCopy[2].content;
      pipeLines[index].pipeDiameter = formDataCopy[3].content;
      pipeLines[index].texture = formDataCopy[4].content;
      this.axios
        .post("/api/pipeline/update", pipeLines[index])
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("修改成功");
            this.dataList = [].concat(pipeLines);
            this.showChange = false;
            for (let i = 0; i < 5; i++) {
              this.formData[i].content = "";
            }
          }
        })
        .catch(() => {
          Toast.fail("修改失败");
        });
    },
    addEle() {
      this.showAdd = true;
    },
    addCancel() {
      this.showAdd = false;
    },
    addConfirm(formDataCopy) {
      let pipeLine = {};
      pipeLine.name = formDataCopy[0].content;
      pipeLine.length = formDataCopy[1].content;
      pipeLine.manufacturer = formDataCopy[2].content;
      pipeLine.pipeDiameter = formDataCopy[3].content;
      pipeLine.texture = formDataCopy[4].content;
      this.axios
        .post("/api/pipeline/add", pipeLine)
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("添加成功");
            this.dataList = this.dataList.concat(pipeLine);
            this.showAdd = false;
            for (let i = 0; i < 5; i++) {
              this.formData[i].content = "";
            }
            this.getData();
          }
        })
        .catch(() => {
          Toast.fail("添加失败");
        });
    },
  },
};
</script>

<style scoped>
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
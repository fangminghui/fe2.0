<template>
  <list>
    <c-point
      v-for="(point, index) in dataList"
      :key="point.id"
      :index="index"
      :point="point"
      @delete-ele="deleteEle"
      @change-ele="changeEle"
    />
  </list>
  <c-confirm v-show="showDelete" :content="'确定要删除吗？'" @cancel="deleteCancel" @confirm="deleteConfirm" />
  <c-form v-if="showChange" :title="'修改'" :formData="formData" @cancel="changeCancel" @confirm="changeConfirm" />
  <div class="addButton" @click="addEle">+</div>
  <c-form v-if="showAdd" :title="'添加'" :formData="formData" @cancel="addCancel" @confirm="addConfirm" />
</template>
<script>
import { List } from "vant";
import CPoint from "../components/CPoint";
import publicFunc from "../publicFunc";
import qs from "qs";
import CConfirm from "../components/CConfirm.vue";
import CForm from "../components/CForm.vue";
import { Toast } from "vant";
export default {
  components: {
    List,
    CPoint,
    CConfirm,
    CForm,
  },
  props: { lineId: Number },
  created() {
    this.getData();
  },
  data() {
    return {
      dataList: [],
      showDelete: false,
      showChange: false,
      showAdd: false,
      dataIndex: -1,
      api: "api/pipe_point/list",
      para: {
        pipelineId: this.lineId,
      },
      formData: [
        {
          title: "海拔",
          kind: "search",
          placeholder: "输入管线点海拔",
          content: "",
        },
        {
          title: "经度",
          kind: "search",
          placeholder: "输入管线点经度",
          content: "",
        },
        {
          title: "纬度",
          kind: "search",
          placeholder: "输入管线点纬度",
          content: "",
        },
      ],
    };
  },
  methods: {
    async getData() {
      let result = await publicFunc.getData(this.api, this.para, 0);
      if (result.length > 0) {
        this.dataList = result;
        this.$emit("finish");
      } else {
        this.$emit("nodata");
      }
      this.loading = false;
    }, //获取数据
    deleteEle(index) {
      this.dataIndex = index;
      this.showDelete = true;
    },
    deleteCancel() {
      this.showDelete = false;
    },
    deleteConfirm() {
      this.axios
        .post("/api/pipe_point/delete", qs.stringify({ id: this.dataList[this.dataIndex].id }))
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("删除成功");
            if (this.dataList.length === 1) {
              this.getData();
            }
            this.showDelete = false;
            this.dataList.splice(this.dataIndex, 1);
          }
        });
    },
    changeEle(obj, index) {
      this.dataIndex = index;
      this.formData[0].content = obj.altitude;
      this.formData[1].content = obj.latitude;
      this.formData[2].content = obj.longitude;
      this.showChange = true;
    },
    changeCancel() {
      for (let i = 0; i < 3; i++) {
        this.formData[i].content = "";
      }
      this.showChange = false;
    },
    changeConfirm(formDataCopy) {
      let index = this.dataIndex;
      let pipeLines = this.dataList.slice();
      pipeLines[index].altitude = formDataCopy[0].content;
      pipeLines[index].latitude = formDataCopy[1].content;
      pipeLines[index].longitude = formDataCopy[2].content;
      this.axios
        .post("/api/pipe_point/update", pipeLines[index])
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("修改成功");
            this.dataList = [].concat(pipeLines);
            this.showChange = false;
            for (let i = 0; i < 3; i++) {
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
      let point = {};
      point.pipelineId = this.lineId;
      point.altitude = formDataCopy[0].content;
      point.latitude = formDataCopy[1].content;
      point.longitude = formDataCopy[2].content;
      this.axios
        .post("/api/pipe_point/add", point)
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("添加成功");
            this.showAdd = false;
            for (let i = 0; i < 3; i++) {
              this.formData[i].content = "";
            }
            setTimeout(() => {
              this.getData();
            }, 1000);
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
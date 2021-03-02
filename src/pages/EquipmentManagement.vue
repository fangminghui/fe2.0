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
      <c-equipment-management
        v-for="(equipmentManagement, index) in dataList"
        :key="equipmentManagement.id"
        :index="index"
        :equipmentManagement="equipmentManagement"
        @delete-ele="deleteEle"
        @change-ele="changeEle"
        class="equipmentManagement"
      />
    </list>
  </pull-refresh>
  <c-confirm v-show="showDelete" :content="'确定要删除吗？'" @cancel="deleteCancel" @confirm="deleteConfirm" />
  <c-form v-if="showChange" :title="'修改'" :formData="formData" @cancel="changeCancel" @confirm="changeConfirm" />
  <div class="addButton" @click="addEle">+</div>
  <c-form v-if="showAdd" :title="'添加'" :formData="formData" @cancel="addCancel" @confirm="addConfirm" />
</template>

<script>
import CEquipmentManagement from "../components/CEquipmentManagement";
import publicFunc from "../publicFunc";
import qs from "qs";
import CConfirm from "../components/CConfirm.vue";
import CForm from "../components/CForm.vue";
import { Toast } from "vant";
import { List, PullRefresh } from "vant";
import CSelectBar from "../components/CSelectBar";

export default {
  components: {
    CEquipmentManagement,
    CConfirm,
    CForm,
    List,
    PullRefresh,
    CSelectBar,
  },
  created() {
    this.getData();
    this.getlist_grade1();
    this.getequipmentType();
  },
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      dataList: [],
      selection: [
        {
          title: "设备编号",
          kind: "search",
          text: "输入设备编号",
        },
        {
          title: "设备名称",
          kind: "search",
          text: "输入设备名称",
        },
        {
          title: "设备类型",
          kind: "search",
          text: "设备类型",
        },
        {
          title: "运行状态",
          kind: "select",
          content: "",
          options: [
            {
              value: "",
              text: "全部",
            },
            {
              value: 0,
              text: "正常运行",
            },
            {
              value: 1,
              text: "运行异常",
            },
          ],
        },
      ],
      para: {
        pageNum: 1,
        pageSize: 10,
        deviceNumber: "",
        deviceName: "",
        state: "",
        typeId: "",
      },
      showDelete: false,
      showChange: false,
      showAdd: false,
      dataIndex: -1,
      formData: [
        {
          title: "设备编号",
          kind: "search",
          placeholder: "输入设备编号",
          content: "",
        },
        {
          title: "设备名称",
          kind: "search",
          placeholder: "输入设备名称",
          content: "",
        },
        {
          title: "经度",
          kind: "search",
          placeholder: "输入经度",
          content: "",
        },
        {
          title: "纬度",
          kind: "search",
          placeholder: "输入纬度",
          content: "",
        },
        {
          title: "海拔(米)",
          kind: "search",
          placeholder: "输入海拔",
          content: "",
        },
        {
          title: "运行状态",
          kind: "select",
          placeholder: [
            { value: "0", option: "正常运行" },
            { value: "1", option: "设备异常" },
          ],
          content: "",
          value: "",
        },
        {
          title: "设备类型",
          kind: "select",
          placeholder: [],
          content: "",
          value: "",
        },
        {
          title: "所属设备",
          kind: "select",
          placeholder: [],
          content: "",
          value: "",
        },
      ],
      list_grade1: [],
      equipmentType: [],
      api: "api/equipment/list_new",
    };
  },
  methods: {
    async getlist_grade1() {
      let response = await this.axios.get("/api/equipment/list_grade1");
      this.list_grade1 = response.data.data;
      for (let item of this.list_grade1) {
        let option = {
          value: item.id,
          option: item.deviceName,
        };
        this.formData[7].placeholder.push(option);
      }
    },
    async getequipmentType() {
      let para = {
        pageNum: 1,
        pageSize: 50,
      };
      this.equipmentType = await publicFunc.getData("api/equipmentType/list", para);
      for (let item of this.equipmentType) {
        let option = {
          value: item.id,
          option: item.typeName,
        };
        this.formData[6].placeholder.push(option);
      }
    },
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
        this.$emit("noData");
      }
      this.loading = false;
    }, //获取数据
    getMore() {
      setTimeout(async () => {
        let result = await publicFunc.getData(this.api, this.para);
        if (result.length > 0) {
          this.para.pageNum++;
          this.dataList = this.dataList.concat(result);
          console.log(this.para.pageNum);
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
    deleteEle(index) {
      this.dataIndex = index;
      this.showDelete = true;
    },
    changeEle(obj, index) {
      this.dataIndex = index;
      this.formData[0].content = obj.deviceNumber;
      this.formData[1].content = obj.deviceName;
      this.formData[2].content = obj.longitude;
      this.formData[3].content = obj.latitude;
      this.formData[4].content = obj.altitude;
      if (obj.state !== null) {
        this.formData[5].content = obj.state === 1 ? "设备异常" : "正常运行";
      }
      if (obj.typeId !== null) {
        let elem1 = this.equipmentType.filter((ele) => {
          return ele.id === obj.typeId;
        });
        this.formData[6].content = elem1[0].typeName;
      }
      if (obj.parentId !== null) {
        let elem2 = this.list_grade1.filter((ele) => {
          return ele.id === obj.parentId;
        });
        this.formData[7].content = elem2[0].deviceName;
      }
      this.showChange = true;
    },
    deleteCancel() {
      this.showDelete = false;
    },
    deleteConfirm() {
      this.axios
        .post("/api/equipment/delete", qs.stringify({ id: this.dataList[this.dataIndex].id }))
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("删除成功");
            this.showDelete = false;
            this.dataList.splice(this.dataIndex, 1);
          }
        });
    },
    changeCancel() {
      for (let i = 0; i < 8; i++) {
        this.formData[i].content = "";
      }
      this.showChange = false;
    },
    changeConfirm(formDataCopy) {
      let index = this.dataIndex;
      let em = this.dataList.slice();
      em[index].deviceNumber = formDataCopy[0].content;
      em[index].deviceName = formDataCopy[1].content;
      em[index].longitude = formDataCopy[2].content;
      em[index].latitude = formDataCopy[3].content;
      em[index].altitude = formDataCopy[4].content;
      em[index].state = formDataCopy[5].value;
      em[index].typeId = formDataCopy[6].value;
      em[index].parentId = formDataCopy[7].value;
      this.axios.post("/api/equipment/updateInfo", em[index]).then((response) => {
        if (response.data.code === 200) {
          Toast.success("修改成功");
          this.dataList = [].concat(em);
          this.showChange = false;
        }
      });
    },
    addEle() {
      for (let i = 0; i < 8; i++) {
        this.formData[i].content = "";
      }
      this.showAdd = true;
    },
    addCancel() {
      this.showAdd = false;
    },
    addConfirm(formDataCopy) {
      console.log(formDataCopy);
      this.showAdd = false;
      let em = {};
      em.deviceNumber = formDataCopy[0].content;
      em.deviceName = formDataCopy[1].content;
      em.longitude = formDataCopy[2].content;
      em.latitude = formDataCopy[3].content;
      em.altitude = formDataCopy[4].content;
      em.state = formDataCopy[5].value;
      em.typeId = formDataCopy[6].value;
      em.parentId = formDataCopy[7].value;
      this.this.axios.post("/api/equipment/add", em).then((response) => {
        if (response.data.code === 200) {
          Toast.success("添加成功");
          this.dataList = this.dataList.concat(em);
          this.showAdd = false;
          for (let i = 0; i < 8; i++) {
            this.formData[i].content = "";
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.equipmentManagement {
  width: 100%;
}
.popDiv {
  width: 50vw;
  height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.addButton {
  position: fixed;
  right: 2vw;
  bottom: 12vh;
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
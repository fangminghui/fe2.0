<template>
  <div class="sqls">
    <field
      v-model="fieldValue"
      input-align="right"
      is-link
      readonly
      label="设备"
      placeholder="请选择设备"
      @click="show = true"
      size="large"
    />
    <popup v-model:show="show" round position="bottom">
      <loading class="addressLoading" v-if="loading" size="40px" color="#1989fa">加载中...</loading>
      <cascader
        v-model="cascaderValue"
        title="请选择设备"
        :options="options"
        @change="change"
        @close="show = false"
        @finish="onFinish"
      />
    </popup>
    <c-sql
      v-for="(sql,index) in dataList"
      :sql="sql"
      :index="index"
      :key="index"
      @delete-ele="deleteEle"
      @change-ele="changeEle"
    />
    <pagination v-model="this.para.pageNum" :page-count="pageCount" mode="simple" class="pagination" @change="getData" />
  </div>
  <c-confirm v-show="showDelete" :content="'确定要删除吗？'" @cancel="deleteCancel" @confirm="deleteConfirm" />
  <c-form v-if="showChange" :title="'修改'" :formData="formData" @cancel="changeCancel" @confirm="changeConfirm" />
  <div class="addButton" @click="addEle">+</div>
  <c-form v-if="showAdd" :title="'添加'" :formData="formData" @cancel="addCancel" @confirm="addConfirm" />
</template>

<script>
import { Pagination } from "vant";
import publicFunc from "../publicFunc";
import CSql from "../components/CSQL.vue";
import { Field, Popup, Cascader, loading } from "vant";
import CConfirm from "../components/CConfirm.vue";
import CForm from "../components/CForm.vue";
import { Toast } from "vant";
import qs from "qs";
export default {
  components: {
    Pagination,
    Cascader,
    Field,
    Popup,
    loading,
    CSql,
    CConfirm,
    CForm,
  },
  created() {
    this.getRoot();
  },
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageCount: 1,
      show: true,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
      para: { pageNum: 1, pageSize: 5, equipmentId: 0 },
      loading: true,
      showDelete: false,
      dataIndex: "",
      showAdd: false,
      showChange: false,
      formData: [
        {
          title: "sql列名",
          kind: "search",
          placeholder: "输入列名",
          content: "",
        },
        {
          title: "类型",
          kind: "select",
          placeholder: [
            { value: 1, option: "开关量" },
            { value: 2, option: "模拟量" },
            { value: 3, option: "累计量" },
          ],
          content: "",
          value: "",
        },
        {
          title: "描述",
          kind: "search",
          placeholder: "输入描述",
          content: "",
        },
        {
          title: "单位",
          kind: "search",
          placeholder: "输入单位",
          content: "",
        },
      ],
    };
  },
  methods: {
    async getData() {
      let apiPath = "/api/column_mapping/list";
      let response = await this.axios.get(apiPath + "?" + publicFunc.getPara(this.para));
      this.dataList = response.data.data.resultList;
      this.pageCount = parseInt((response.data.data.total + 4) / 5);
    },
    async getRoot() {
      let response = await this.axios.get("/api/equipment/list_grade1");
      let list_grade1 = response.data.data;
      this.options = this.setOption(list_grade1);
      for (let option of this.options) {
        option.children = [{ value: "", text: "无" }];
      }
      this.loading = false;
    },
    setOption(list) {
      let options = [];
      let obj = {};
      for (let index in list) {
        obj = {
          text: list[index].deviceName,
          value: list[index].id,
        };
        options[index] = obj;
      }
      return options;
    },
    async change({ value }) {
      if (value) {
        this.loading = true;
        for (let index in this.options) {
          if (this.options[index].value === value) {
            let response = await this.axios.get("/api/equipment/list_child?id=" + value);
            let list_grade2 = response.data.data;
            if (list_grade2.length > 0) {
              this.options[index].children = this.setOption(list_grade2);
            } else {
              this.options[index].children = [{ value: "", text: "无" }];
            }
          }
        }
        this.loading = false;
      }
    },
    async onFinish({ value, selectedOptions }) {
      if (value) {
        this.currentPage = 1;
        this.show = false;
        this.para.equipmentId = value;
        this.getData();
        this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      }
    },
    deleteEle(index) {
      this.dataIndex = index;
      this.showDelete = true;
    },
    deleteCancel() {
      this.showDelete = false;
    },
    deleteConfirm() {
      this.axios
        .post("/api/column_mapping/delete", qs.stringify({ id: this.dataList[this.dataIndex].id }))
        .then((response) => {
          if (response.data.code === 200) {
            Toast.success("删除成功");
            this.showDelete = false;
            this.dataList.splice(this.dataIndex, 1);
          }
        });
    },
    addEle() {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].content = "";
      }
      this.showAdd = true;
    },
    addCancel() {
      this.showAdd = false;
    },
    addConfirm(formDataCopy) {
      this.showAdd = false;
      let em = {
        columnName: "string",
        dataType: 0,
        description: "string",
        equipmentId: this.dataList[0].equipmentId,
        id: 0,
        tableName: this.dataList[0].tableName,
        unit: "string",
      };
      em.columnName = formDataCopy[0].content;
      em.dataType = formDataCopy[1].value;
      em.description = formDataCopy[2].content;
      em.unit = formDataCopy[3].content;
      this.axios.post("/api/column_mapping/add", em).then((response) => {
        if (response.data.code === 200) {
          Toast.success("添加成功");
          this.showAdd = false;
          for (let i = 0; i < this.formData.length; i++) {
            this.formData[i].content = "";
          }
          setTimeout(() => {
            this.getData();
          }, 1000);
        }
      });
    },
    changeEle(obj, index) {
      this.dataIndex = index;
      this.formData[0].content = obj.columnName;
      this.formData[1].content = obj.dataType === 1 ? "开关量" : obj.dataType === 2 ? "模拟量" : "累积量";
      this.formData[2].content = obj.description;
      this.formData[3].content = obj.unit;
      this.showChange = true;
    },
    changeCancel() {
      for (let i = 0; i < this.formData.length; i++) {
        this.formData[i].content = "";
      }
      this.showChange = false;
    },
    changeConfirm(formDataCopy) {
      let index = this.dataIndex;
      let em = this.dataList.slice();
      em[index].columnName = formDataCopy[0].content;
      em[index].dataType = formDataCopy[1].value;
      em[index].description = formDataCopy[2].content;
      em[index].unit = formDataCopy[3].content;
      this.axios.post("/api/column_mapping/update", em[index]).then((response) => {
        if (response.data.code === 200) {
          Toast.success("修改成功");
          this.dataList = [].concat(em);
          this.showChange = false;
        }
      });
    },
  },
};
</script>

<style>
.sqls {
  height: 100vh;
  width: 100vw;
  background: #f6f6f6;
}
.pagination {
  position: fixed;
  /* bottom: 2vh; */
  width: 80vw;
  margin-left: 10vw;
}
.noData {
  width: 100vw;
  text-align: center;
  margin-top: 40vh;
}
.van-swipe__track {
  height: 30vh;
}
.addressLoading {
  position: absolute;
  width: 100%;
  height: 80%;
  margin-top: 20%;
  background: white;
  z-index: 2007;
  display: flex;
  justify-content: center;
  align-items: center;
}
.addButton {
  position: fixed;
  right: 2vw;
  bottom: 23vh;
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
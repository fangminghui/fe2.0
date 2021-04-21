<template>
  <div class="videos">
    <field
      v-model="fieldValue"
      input-align="right"
      is-link
      readonly
      label="监控区域"
      placeholder="请选择监控区域"
      @click="show = true"
      size="large"
    />
    <popup v-model:show="show" round position="bottom">
      <loading class="addressLoading" v-if="loading" size="40px" color="#1989fa">加载中...</loading>
      <cascader
        v-model="cascaderValue"
        title="请选择监控区域"
        :options="options"
        @change="change"
        @close="show = false"
        @finish="onFinish"
      />
    </popup>
    <c-video v-for="videoData in dataList" :videoData="videoData" :key="videoData.cameraIndexCode" />
    <pagination v-model="currentPage" :page-count="pageCount" mode="simple" class="pagination" @change="getData" />
  </div>
</template>

<script>
import { Pagination } from "vant";
import CVideo from "../components/CVideo.vue";
import publicFunc from "../publicFunc";
import { Field, Popup, Cascader, loading } from "vant";
export default {
  components: {
    Pagination,
    CVideo,
    Cascader,
    Field,
    Popup,
    loading,
  },
  created() {
    this.getRootAddress();
  },
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageCount: 1,
      allOrsome: "all",
      indexCode: "",
      show: true,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
      loading: true,
    };
  },
  methods: {
    getData() {
      if (this.allOrsome === "all") {
        this.getAllCameres();
      } else {
        this.getSomeCameres();
      }
    },
    async getAllCameres() {
      let apiPath = "/api/resource/v1/cameras";
      let requestBody = { pageNo: this.currentPage, pageSize: 2 };
      let response = await publicFunc.getCamera(apiPath, requestBody);
      if (response) {
        this.dataList = response.data.data.list;
        this.pageCount = parseInt((response.data.data.total + 1) / 2);
      } else {
        this.dataList = [];
      }
    }, //获取所有的摄像头
    async getSomeCameres() {
      let apiPath = "/api/resource/v1/regions/regionIndexCode/cameras";
      let requestBody = { pageNo: this.currentPage, pageSize: 2, regionIndexCode: this.indexCode };
      let response = await publicFunc.getCamera(apiPath, requestBody);
      if (response) {
        this.dataList = response.data.data.list;
        this.pageCount = parseInt((response.data.data.total + 1) / 2);
      } else {
        this.dataList = [];
      }
    }, //获取部分摄像头
    async getRootAddress() {
      let apiPath = "/api/resource/v1/regions/root";
      let requestBody = "";
      let response = await publicFunc.getCamera(apiPath, requestBody);
      let options = await this.setAddressList(response.data.data.indexCode);
      let obj = {
        text: "全部",
        value: "",
      };
      this.options = [obj].concat(options);
      this.loading = false;
    },
    //获取根地址
    async setAddressList(indexCode) {
      let list = await this.getChildAddress(indexCode);
      let options = [];
      let obj = {};
      for (let index in list) {
        obj = {
          text: list[index].name,
          value: list[index].indexCode,
        };
        let list2 = await this.getChildAddress(list[index].indexCode);
        if (list2.length !== 0) {
          obj.children = [];
        }
        options[index] = obj;
      }
      return options;
    },
    //设置该地址的子地址，如子地址有子地址，标记点击后触发change，如无，点击后直接finish
    async getChildAddress(indexCode) {
      let apiPath = "/api/resource/v2/regions/subRegions";
      let requestBody = { parentIndexCode: indexCode, resourceType: "camera", pageNo: 1, pageSize: 100 };
      let response = await publicFunc.getCamera(apiPath, requestBody);
      return response.data.data.list;
    },
    //获取子地址
    async addAddressList(options, value) {
      for (let option of options) {
        if (option.value === value) {
          let list = await this.setAddressList(value);
          option.children = list;
        } else {
          if (option.children) {
            await this.addAddressList(option.children, value);
          }
        }
      }
    },
    //遍历找到当前点击位置，插入新地址数组
    async change({ value }) {
      if (value) {
        this.loading = true;
        await this.addAddressList(this.options, value);
        this.loading = false;
      }
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.currentPage = 1;
      if (selectedOptions[0].text === "全部") {
        this.getAllCameres();
        this.allOrsome = "all";
      } else {
        this.allOrsome = "some";
        this.indexCode = selectedOptions[selectedOptions.length - 1].value;
        this.getSomeCameres();
      }
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
    },
  },
};
</script>

<style>
.videos {
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
.van-swipe {
  overflow: auto;
}
.van-cascader__options {
  height: 100%;
}
.addressLoading {
  position: absolute;
  width: 100%;
  height: 70%;
  margin-top: 30%;
  background: white;
  z-index: 2007;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
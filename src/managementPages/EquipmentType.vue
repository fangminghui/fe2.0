<template>
  <div class="equipmenttype" v-if="dataList.length>=2">
    <c-equipment-type v-for="(item , index) in dataList" :key="index" :item="item" />
  </div>
</template>

<script>
import publicFunc from "../publicFunc";
import CEquipmentType from "../components/CEquipmentType.vue";
export default {
  components: { CEquipmentType },
  created() {
    this.getData();
  },
  data() {
    return {
      dataList: [],
      para: {
        pageNum: 1,
        pageSize: 50,
      },
    };
  },
  methods: {
    async getData() {
      this.$emit("loading");
      let resultList = await publicFunc.getData("api/equipmentType/list", this.para);
      if (resultList) {
        this.dataList = resultList;
      } else {
        this.dataList = [];
      }
      this.$emit("finish");
    }, //获取数据
  },
};
</script>

<style scoped>
.equipmenttype {
  min-height: 100vh;
  width: 100vw;
  background-color: #f6f6f6;
  /* box-sizing: border-box; */
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
</style>
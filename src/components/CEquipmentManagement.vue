<template>
  <div :class="['equipment','id'+id]">
    <div class="left">
      <div v-if="equipmentManagement.equipmentType">
        <img :src="equipmentManagement.equipmentType.img" alt class="equipmentSvg" />
      </div>
      <div class="equipmentText" v-if="equipmentManagement.equipmentType">{{equipmentManagement.equipmentType.typeName}}</div>
    </div>
    <div class="middle">
      <div class="line">编号：{{equipmentManagement.deviceNumber}}</div>
      <div class="line">设备：{{equipmentManagement.deviceName}}</div>
      <div class="line" v-if="equipmentManagement.parentId">所属：{{parent.deviceName}}</div>
      <div class="line">经纬：{{equipmentManagement.longitude}} / {{equipmentManagement.latitude}}</div>
      <div class="line">海拔：{{equipmentManagement.altitude}}米</div>
      <div class="line" v-if="equipmentManagement.state">运行状态：设备异常</div>
      <div class="line" v-else>状态：正常运行</div>
    </div>
    <div class="right">
      <div class="change" @click="changeEle">修改</div>
      <div class="delete" @click="deleteEle">删除</div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import publicFunc from "../publicFunc";
export default {
  props: { equipmentManagement: Object, index: Number },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
    this.getParent();
  },
  data() {
    return {
      id: this.equipmentManagement.id,
      state: this.equipmentManagement.state ? "设备异常" : "正常运行",
      parent: "",
    };
  },
  methods: {
    touchHandle: throttle(function () {
      setTimeout(() => {
        let ele = document.getElementsByClassName("id" + this.id)[0];
        let width = ele.scrollWidth;
        let clientWidth = document.documentElement.clientWidth;
        let left = ele.scrollLeft;
        if (left > width * 0.14) {
          ele.scrollLeft = width - clientWidth;
        } else {
          ele.scrollLeft = 0;
        }
      }, 200);
    }, 500),
    deleteEle() {
      this.$emit("delete-ele", this.index);
    },
    changeEle() {
      this.$emit("change-ele", this.equipmentManagement, this.index);
    },
    async getParent() {
      if (this.equipmentManagement.parentId) {
        let para = {
          pageNum: 1,
          pageSize: 1,
          id: this.equipmentManagement.parentId,
        };
        let resultList = await publicFunc.getData("api/equipment/list_new", para);
        this.parent = resultList[0];
      }
    },
  },
};
</script>

<style scoped>
.equipment {
  width: 100%;
  height: 20vh;
  border: 0.1vw solid black;
  border-width: 0.1vw 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: #f3f3f3;
  overflow: scroll;
}
.left {
  flex: none;
  width: 20vw;
  margin: 0 2vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.equipmentSvg {
  width: 10vw;
  display: block;
}
.equipmentText {
  width: 100%;
  text-align: center;
}
.middle {
  flex: none;
  width: 76vw;
}
.line {
  width: 76vw;
  display: flex;
  margin: 0.5vh 0;
  color: black;
}
.column {
  min-width: 28vw;
  max-width: 46vw;
}
.right {
  flex: none;
  width: 40vw;
  height: 100%;
  display: flex;
  align-items: center;
}
.change {
  width: 20vw;
  height: 100%;
  background: #99ccff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.delete {
  width: 20vw;
  height: 100%;
  background: #f08767;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
</style>
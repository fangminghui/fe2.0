<template>
  <div :class="['cpoint','id'+id]">
    <div class="left">
      <div class="line">
        <div class="column">管线点序号：{{index+1}}</div>
        <div class="column">海拔：{{point.altitude}}米</div>
      </div>
      <div class="line">
        <div class="column">经纬：{{point.latitude}} / {{point.longitude}}</div>
      </div>
    </div>
    <div class="right">
      <div class="change" @click="changeEle">修改</div>
      <div class="delete" @click="deleteEle">删除</div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
export default {
  props: { point: Object, index: Number },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },

  data() {
    return {
      id: this.point.id,
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
      this.$emit("change-ele", this.point, this.index);
    },
  },
};
</script>

<style scoped>
.cpoint {
  width: 100%;
  height: 10vh;
  border-bottom: 0.1vw solid black;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: #f3f3f3;
  overflow: scroll;
}
.left {
  flex: none;
  width: 100vw;
}
.line {
  width: 100vw;
  display: flex;
  margin: 0.5vh 0;
  padding: 0 16px;
  box-sizing: border-box;
}
.column {
  min-width: 50%;
  max-width: 100%;
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
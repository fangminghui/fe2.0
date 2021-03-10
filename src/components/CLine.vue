<template>
  <div :class="['cline','id'+id]">
    <div class="left">
      <div class="line">
        <div class="column1">管线名：{{pipeLine.name}}</div>
        <div class="column">长度：{{pipeLine.length}}米</div>
      </div>
      <div class="line">
        <div class="column">厂商：{{pipeLine.manufacturer}}</div>
        <div class="column2">管径：{{pipeLine.pipeDiameter}}米</div>
        <div class="column">材质：{{pipeLine.texture}}</div>
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
  props: { pipeLine: Object, index: Number },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },

  data() {
    return {
      id: this.pipeLine.id,
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
      this.$emit("change-ele", this.pipeLine, this.index);
    },
  },
};
</script>

<style scoped>
.cline {
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
.column1 {
  min-width: 66%;
}
.column2 {
  min-width: 33%;
  padding-left: 8%;
  box-sizing: border-box;
}
.column {
  min-width: 33%;
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
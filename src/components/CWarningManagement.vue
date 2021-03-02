<template>
  <div :class="['warning','id'+id]">
    <div class="left">
      <div v-if="WarningManagement.typeName === '警告'">
        <img src="../assets/svg/warning1.svg" alt class="warningSvg" />
        <div class="warningText">警告</div>
      </div>
      <div v-else-if="WarningManagement.typeName === '报警'">
        <img src="../assets/svg/warning2.svg" alt class="warningSvg" />
        <div class="warningText">报警</div>
      </div>
      <div v-else-if="WarningManagement.typeName === '事故'">
        <img src="../assets/svg/warning3.svg" alt class="warningSvg" />
        <div class="warningText">事故</div>
      </div>
    </div>
    <div class="middle">
      <div class="line">
        <div class="column">设备编号：{{WarningManagement.deviceId}}</div>
        <div class="column">地点：{{WarningManagement.site}}</div>
      </div>
      <div class="line">数据字段：{{WarningManagement.fieldName}}</div>
      <div class="line">
        <div class="column">上临界点：{{WarningManagement.highAlarmSetting}}</div>
        <div class="column">下临界点：{{WarningManagement.lowAlarmSetting}}</div>
      </div>
      <div class="line">内容：{{WarningManagement.content}}</div>
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
  props: { WarningManagement: Object, index: Number },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },

  data() {
    return {
      id: this.WarningManagement.id,
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
      this.$emit("change-ele", this.WarningManagement, this.index);
    },
  },
};
</script>

<style scoped>
.warning {
  width: 100%;
  height: 15vh;
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
  justify-content: center;
  align-items: center;
}
.warningSvg {
  width: 10vw;
  display: block;
}
.warningText {
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
}
.column {
  width: 38vw;
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
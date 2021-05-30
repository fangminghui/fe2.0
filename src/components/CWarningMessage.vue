<template>
  <div
    :class="['warning', 'warning'+warningMessage.type,'id'+warningMessage.id,'confirm'+warningMessage.confirmStatus]"
  >
    <div class="left">
      <div class="svgBackground">
        <div v-if="warningMessage.type === 0">
          <img src="../assets/svg/warning1.svg" alt class="warningSvg" />
          <div class="warningText">警告</div>
        </div>
        <div v-else-if="warningMessage.type === 1">
          <img src="../assets/svg/warning2.svg" alt class="warningSvg" />
          <div class="warningText">报警</div>
        </div>
        <div v-else-if="warningMessage.type === 2">
          <img src="../assets/svg/warning3.svg" alt class="warningSvg" />
          <div class="warningText">事故</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="rightInfos">
        <div class="rightInfo">
          <img src="../assets/svg/time.svg" alt class="timeSvg" />
          {{ warningMessage.createTime.split(" ")[0] }}
        </div>
        <div class="rightInfo">
          <div>&nbsp;&nbsp;</div>
          <img src="../assets/svg/address.svg" alt class="timeSvg" />
          {{ warningMessage.alarmSite }}
        </div>
        <div class="rightInfo">
          <img src="../assets/svg/equipment.svg" alt class="timeSvg" />
          {{ warningMessage.alarmDevice }}
        </div>
        <div class="rightInfo">
          <img src="../assets/svg/info.svg" alt class="timeSvg" />
          {{ warningMessage.content }}
        </div>
      </div>
    </div>
    <div class="overright">
      <div class="confirm" @click="confirm">确认</div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";

export default {
  props: { warningMessage: Object },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.warningMessage.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },
  methods: {
    touchHandle: throttle(function () {
      setTimeout(() => {
        let ele = document.getElementsByClassName("id" + this.warningMessage.id)[0];
        let width = ele.scrollWidth;
        let clientWidth = document.documentElement.clientWidth;
        let left = ele.scrollLeft;
        if (left > width * 0.1) {
          ele.scrollLeft = width - clientWidth;
        } else {
          ele.scrollLeft = 0;
        }
      }, 200);
    }, 500),
    confirm() {
      this.$emit("confirm", this.warningMessage.id);
    },
  },
};
</script>

<style scoped>
.warning {
  width: 100vw;
  height: 10vh;
  border: 0.1vw solid black;
  border-width: 0.1vw 0;
  display: flex;
  box-sizing: border-box;
  overflow: scroll;
}
/* .warning0 {
  background: rgba(204, 204, 204, 0.5);
} */
.confirm1 {
  background: rgba(204, 204, 204, 0.5) !important;
}
.warning0 {
  background: rgba(241, 145, 73, 0.3);
}
.warning1 {
  background: rgba(230, 65, 0, 0.5);
}
.warning2 {
  background: rgba(255, 0, 0, 0.7);
}
.overright {
  flex: none;
  width: 20vw;
  height: 100%;
  display: flex;
  align-items: center;
}
.confirm {
  width: 20vw;
  height: 100%;
  background: #99ccff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.left {
  width: 20vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2vw;
  flex: none;
}
.svgBackground {
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  font-size: 3.5vw;
  line-height: 3.5vw;
  font-weight: bold;
}
.warningSvg {
  width: 10vw;
  display: block;
}
.warningText {
  width: 100%;
  text-align: center;
}
.right {
  flex: none;

  width: 76vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rightInfos {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.rightInfo {
  margin: 0.5vh 0;
  flex: 1 1 33.33%;
  display: flex;
  align-items: center;
}
.timeSvg {
  width: 5vw;
  margin-right: 0.5vw;
}
</style>
<template>
  <div
    :class="['warning', 'warning'+warningMessageItem.type,'id'+warningMessageItem.id,'confirm'+warningMessageItem.confirmStatus]"
  >
    <div class="left">
      <div class="svgBackground">
        <div v-if="warningMessageItem.type === 0">
          <img src="../assets/svg/warning1.svg" alt class="warningSvg" />
          <div class="warningText">警告</div>
        </div>
        <div v-else-if="warningMessageItem.type === 1">
          <img src="../assets/svg/warning2.svg" alt class="warningSvg" />
          <div class="warningText">报警</div>
        </div>
        <div v-else-if="warningMessageItem.type === 2">
          <img src="../assets/svg/warning3.svg" alt class="warningSvg" />
          <div class="warningText">事故</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="rightInfos">
        <div class="rightInfo">
          <img src="../assets/svg/time.svg" alt class="timeSvg" />
          {{ warningMessageItem.createTime}}
        </div>
        <div class="rightInfo">
          <img src="../assets/svg/address.svg" alt class="timeSvg" />
          {{ warningMessageItem.alarmSite }}
          <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
          <img src="../assets/svg/equipment.svg" alt class="timeSvg" />
          {{ warningMessageItem.alarmDevice }}
        </div>
        <div class="rightInfo">
          <img src="../assets/svg/info.svg" alt class="timeSvg" />
          {{ warningMessageItem.content }}
        </div>
      </div>
    </div>
    <div class="overright" v-if="warningMessageItem.confirmStatus===0">
      <div class="confirm" @click="confirm">确认</div>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import axios from "axios";
import { Toast } from "vant";

export default {
  props: { warningMessage: Object },
  data() {
    return { warningMessageItem: this.warningMessage };
  },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.warningMessageItem.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },
  methods: {
    touchHandle: throttle(function () {
      setTimeout(() => {
        let ele = document.getElementsByClassName("id" + this.warningMessageItem.id)[0];
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
    // confirm() {
    //   this.$emit("confirm", this.warningMessageItem.id);
    // },
    confirm() {
      axios
        .post(`/api/warning/confirm?warningId=${this.warningMessageItem.id}`)
        .then((res) => {
          if (res.data.message === "操作成功") {
            this.warningMessageItem.confirmStatus = 1;
            Toast.success("操作成功");
          } else {
            Toast.fail("操作失败");
          }
        })
        .catch(() => {
          Toast.fail("操作失败");
        });
      // let newDataList = [].concat(this.dataList);
      // let messsage = newDataList.find((e) => e.id === id);
      // messsage.confirmStatus = 1;
      // newDataList = newDataList.filter((e) => e.id !== id);
      // newDataList.push(messsage);
      // this.dataList = newDataList;
    },
  },
};
</script>

<style scoped>
.warning {
  width: 100vw;
  height: 15vh;
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
  background: rgba(255, 0, 0, 1);
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
  margin: 0.5vh 1vw 0.5vh 0;
  display: flex;
  align-items: center;
  min-width: 60%;
}
.timeSvg {
  width: 5vw;
  margin-right: 0.5vw;
}
</style>
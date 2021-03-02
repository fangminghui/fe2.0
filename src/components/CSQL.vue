<template>
  <div :class="['CSQL','id'+id]">
    <div class="left">
      <div>
        <span class="title">列名：</span>
        <span class="content">{{sql.columnName}}</span>
      </div>
      <div v-show="sql.dataType===1">
        <span class="title">类型：</span>
        <span class="content">开关量</span>
      </div>
      <div v-show="sql.dataType===2">
        <span class="title">类型：</span>
        <span class="content">模拟量</span>
      </div>
      <div v-show="sql.dataType===3">
        <span class="title">类型：</span>
        <span class="content">累计量</span>
      </div>
      <div>
        <span class="title">描述：</span>
        <span class="content">{{sql.description}}</span>
      </div>
      <div>
        <span class="title">单位：</span>
        <span class="content">{{sql.unit}}</span>
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
  props: {
    sql: Object,
    index: Number,
  },
  mounted() {
    let ele = document.getElementsByClassName("id" + this.id)[0];
    ele.addEventListener("touchend", this.touchHandle);
  },
  data() {
    return {
      id: this.sql.id,
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
      this.$emit("change-ele", this.sql, this.index);
    },
  },
};
</script>

<style scoped>
.CSQL {
  height: 17vh;
  width: 100%;
  display: flex;
  border-bottom: 1px solid #333;
  overflow: scroll;
}
.title {
  color: black;
  font-weight: bold;
}
.content {
  color: #333;
  word-break: break-all;
}
.left {
  flex: none;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5vw;
  box-sizing: border-box;
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
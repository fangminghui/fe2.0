<template>
  <div class="masking" @click="noShowOptions" v-show="showOptions" />
  <div :class="['cselect',{'nowSelect':showOptions}]">
    <div class="selectTitle">{{cSelectData.title}}:</div>
    <div class="selectContent" @click="yesShowOptions">
      <div class="currentOption">{{cSelectData.content}}</div>
      <div class="options" v-show="showOptions">
        <div
          class="option"
          v-for="(item,index) in selectData.placeholder"
          :key="index"
          @click="cSelect(item)"
        >{{item.option}}</div>
      </div>
      <img src="../assets/svg/arrow.svg" alt :class="[arrowBottom ? 'arrowBottom': 'arrowTop' ,'arrow']" />
    </div>
  </div>
</template>

<script>
//表单里的单选下拉框
export default {
  props: {
    selectData: Object,
    index: Number,
  },
  data() {
    return {
      arrowBottom: true,
      showOptions: false,
      cSelectData: this.selectData,
    };
  },
  methods: {
    noShowOptions() {
      this.showOptions = false;
      this.arrowBottom = true;
    },
    yesShowOptions() {
      if (this.showOptions) {
        this.noShowOptions();
        return;
      }
      this.showOptions = true;
      this.arrowBottom = false;
    },
    cSelect(item) {
      this.cSelectData.content = item.option;
      this.cSelectData.value = item.value;
      this.$emit("c-select", this.index, this.cSelectData);
    },
  },
};
</script>

<style scoped>
.cselect {
  width: 100%;
  height: 8vw;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #eee;
  padding: 2vw 0;
}
.nowSelect {
  z-index: 3;
}
.selectTitle {
  width: 25%;
}
.selectContent {
  width: 75%;
  display: flex;
  position: relative;
}
.arrowBottom {
  transform: rotate(-90deg);
}
.arrowTop {
  transform: rotate(90deg);
}
.arrow {
  width: 4vw;
  margin-left: 2vw;
}
.currentOption {
  width: 85%;
  height: 8vw;
  padding-left: 5%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
}
.options {
  position: absolute;
  top: 10vw;
  width: 85%;
  border-radius: 0 0 2vw 2vw;
  overflow: hidden;
  border: 1px solid #eee;
  line-height: 12vw;
  max-height: 40vh;
  overflow: scroll;
}
.option {
  width: 100%;
  padding-left: 5%;
  box-sizing: border-box;
  background: white;
}
.masking {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  opacity: 0.7;
  z-index: 2;
}
</style>
<template>
  <div class="formFix">
    <div class="masking" @click="cancel" />
    <div class="cform">
      <div class="formContent">
        <div v-for="(item,index) in formDataCopy" :key="index">
          <div v-if="item.kind === 'search'" class="search">
            <div class="searchTitle">{{item.title}}:</div>
            <input class="searchInput" :placeholder="item.placeholder" v-model="formDataCopy[index].content" />
          </div>
          <div v-else class="select">
            <c-select :selectData="item" :index="index" @c-select="CSelect" />
          </div>
        </div>
        <div class="buttons">
          <div class="button1" @click="cancel">取消</div>
          <div class="button2" @click="confirm">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CSelect from "./CSelect";
export default {
  components: { CSelect },
  props: {
    formData: Array,
    title: String,
  },
  created() {},
  data() {
    return {
      formDataCopy: this.formData,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm", this.formDataCopy);
    },
    CSelect(index, value) {
      this.formDataCopy[index] = value;
    },
  },
};
</script>

<style scoped>
.formFix {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  z-index: 3;
  border: 1px solid #eee;
}
.masking {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.5;
}
.cform {
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
}
.title {
  font-size: 5vw;
  width: 100%;
  text-align: center;
  margin-bottom: 2vh;
}
.formContent {
  display: flex;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1vh 10vw;
  background: white;
  width: 100vw;
}
.search {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  font-size: 4vw;
  line-height: 8vw;
  height: 8vw;
  padding: 1vh 0;
}
.searchTitle {
  width: 25%;
}
.searchInput {
  width: 75%;
  border: 0;
  padding-left: 5%;
}
.buttons {
  display: flex;
  margin-bottom: 2vh;
}
.button1 {
  flex: auto;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  margin-top: 2vh;
  margin-right: 5vw;
  border-radius: 1vh;
}
.button2 {
  flex: auto;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409efe;
  color: white;
  margin-top: 2vh;
  margin-left: 5vw;
  border-radius: 1vh;
}
</style>
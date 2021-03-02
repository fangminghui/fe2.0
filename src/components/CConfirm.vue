<template>
  <div class="cconfirm">
    <div class="masking" />
    <div class="div1">
      <div class="div11">{{content}}</div>
      <div class="div12">
        <div class="div121" @click="cancel">取消</div>
        <div class="div122" @click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped>
.cconfirm {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
}
.masking {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.5;
}
.div1 {
  width: 50vw;
  height: 12vh;
  background: white;
  z-index: 3;
  border-radius: 2vw;
  display: flex;
  flex-direction: column;
}
.div11 {
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1vh 0;
}
.div12 {
  width: 100%;
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 0.1vw solid #333;
}
.div121 {
  height: 100%;
  display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  border-right: 0.1vw solid #333;
}
.div122 {
  display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  color: red;
}
</style>
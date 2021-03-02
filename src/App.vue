<template>
  <div id="app">
    <loading v-if="load" size="40px" color="#1989fa" class="app_loading">加载中...</loading>
    <router-view @loading="loading" @finish="finish" />
  </div>
</template>

<script>
import { Loading } from "vant";

export default {
  name: "App",
  components: {
    Loading,
  },
  data() {
    return {
      load: false,
    };
  },
  methods: {
    loading() {
      this.load = true;
    },
    finish() {
      this.load = false;
    },
  },
};
</script>

<style scoped>
.app_loading {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 10vh;
  position: fixed;
  z-index: 2;
  background: #f6f6f6;
}
</style>

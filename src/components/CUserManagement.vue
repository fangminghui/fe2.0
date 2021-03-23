<template>
  <div class="userCard">
    <div class="left">
      <img :src="User.avatar" class="leftimg" />
      <!-- <div :class="['svgBackground','backColor'+i]">{{ User.username }}</div> -->
    </div>
    <div class="right">
      <div class="rightInfos">
        <div class="line">用户名：{{ User.loginName }}</div>
        <div class="line">性别：{{ sex }}</div>
        <div class="line">姓名：{{ User.username }}</div>
        <!-- <div class="line">角色名：{{ User.avator }}</div> -->
        <!-- <div class="line">密码：{{ User.password }}</div> -->
        <div class="line">电话号码：{{ User.phoneNumber }}</div>
        <div class="line">邮箱：{{ User.email }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { User: Object },
  created() {
    this.getSex();
  },
  updated() {
    this.getSex();
  },
  data() {
    return {
      sex: "",
      i: (this.User.id % 5).toString(),
    };
  },
  methods: {
    getSex() {
      if (this.User.sex === 0) {
        this.sex = "男";
      } else if (this.User.sex === 1) {
        this.sex = "女";
      }
    },
  },
};
</script>

<style scoped>
.userCard {
  width: 100%;
  height: 20vh;
  border: 0.1vw solid black;
  border-width: 0.1vw 0;
  display: flex;
  box-sizing: border-box;
  background: #f3f3f3;
}
.left {
  width: 20vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2vw;
}
.leftimg {
  width: 20vw;
}
.svgBackground {
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 5vw;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.backColor0 {
  background: #99cc33;
}
.backColor1 {
  background: #ff6666;
}
.backColor2 {
  background: #0099cc;
}
.backColor3 {
  background: #cc9999;
}
.backColor4 {
  background: #996600;
}
.right {
  width: 76vw;
  display: flex;
  align-items: center;
}
.line {
  display: flex;
  margin: 1vw 0;
}
.column {
  flex: none;
  width: 50%;
}
</style>
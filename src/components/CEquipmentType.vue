<template>
  <div class="ctt">
    <div class="cttflex">
      <div class="img">
        <img v-if="item.img" :src="item.img" class="img" />
      </div>
      <div class="typeName">{{item.typeName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>

<style>
.ctt {
  display: inline-block;
  width: 25vw;
  height: 25vw;
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-width: 0 2px 2px 0;
}
.ctt:nth-child(4n) {
  border-width: 0 0 2px 0 !important;
}
.cttflex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  width: 25vw;
  height: 25vw;
}
.img {
  width: 15vw;
  height: 15vw;
}
</style>
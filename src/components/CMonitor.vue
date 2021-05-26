<template>
  <div class="cmonitor" v-if="cmonitor.plcData.length!==0">
    <div class="cmonitor_title">{{cmonitor.device_name}}</div>
    <div>
      <list v-if="cmonitor.plcData" finished-text="没有更多了">
        <cell v-for="(item,index) in cmonitor.plcData" :key="index">
          <div class="mycell">
            <div class="span">{{item.name}}</div>
            <div class="span" v-if="item.value===true">
              <div v-if="item.name==='开到位'" class="green"></div>
              <div v-else-if="item.name==='关到位'" class="red"></div>
              <div v-else class="yellow"></div>
            </div>
            <div class="span" v-else-if="item.value===false">
              <div class="gray"></div>
            </div>
            <div class="span" v-else>{{item.value}}&nbsp;{{item.unit}}</div>
          </div>
        </cell>
      </list>
    </div>
  </div>
</template>

<script>
import { List, Cell } from "vant";

export default {
  components: {
    List,
    Cell,
  },
  props: {
    cmonitor: Object,
  },
};
</script>

<style>
.cmonitor {
  position: relative;
  width: 90vw;
  margin: 4vh 0 0 5vw;
  border: 0.5px solid #1296db;
  padding: 5vw;
  box-sizing: border-box;
}
.cmonitor_title {
  position: absolute;
  height: 6vw;
  line-height: 6vw;
  font-size: 5vw;
  padding: 0 3vw;
  box-sizing: border-box;
  background-color: white;
  left: 7vw;
  top: -3vw;
}
.mycell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.span {
  flex: 1 1 50%;
  font-size: 4vw;
  display: flex;
  justify-content: center;
  text-align: center;
}
.green {
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #33cc33;
}
.red {
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #cc3333;
}
.gray {
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #aaa;
}
.yellow {
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: #ffd902;
}
.van-list > .van-cell {
  padding: 1vw;
}
</style>
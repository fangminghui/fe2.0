<template>
  <div class="cgis">
    <div class="plctitle">{{info.name}}</div>
    <loading size="40px" v-if="loading" class="loading">加载中...</loading>
    <div v-else>
      <div class="title">经纬度：{{info.longitude}}&nbsp;/&nbsp;{{info.latitude}}</div>
      <!-- <div v-if="plcDataArray.length===0" class="noData">暂无数据</div>
      <div v-else class="plcData">
        <div v-for="i in length" :key="i" class="eachData">
          <div class="title">{{plcDataArray[0][i-1]}}</div>
          <div class="divider"></div>
          <div class="content">{{plcDataArray[1][i-1]}}</div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { Loading } from "vant";
export default {
  components: {
    Loading,
  },
  props: { info: Object },
  watch: {
    // info() {
    //   this.getData(this.info.equipmentId);
    // },
  },
  data() {
    return {
      plcDataArray: [],
      length: 0,
      loading: false,
    };
  },
  methods: {
    getData(id) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.plcDataArray = [];
      this.axios.get("api/equipment/plcData?id=" + id).then((response) => {
        let plcData = response.data.data;
        if (plcData) {
          let keyArray = [];
          let dataArray = [];
          for (let key in plcData) {
            keyArray.push(key);
            if (key.indexOf("流量") !== -1) {
              dataArray.push(plcData[key] + "m³");
            }
            if (key.indexOf("水位") !== -1) {
              dataArray.push(plcData[key] + "m");
            }

            if (key.indexOf("电量") !== -1) {
              dataArray.push(plcData[key] + "kW·h");
            }
            if (key.indexOf("功率") !== -1) {
              dataArray.push(plcData[key] + "kW");
            }
          }
          this.length = keyArray.length;
          this.plcDataArray[0] = keyArray;
          this.plcDataArray[1] = dataArray;
        }
      });
    },
  },
};
</script>

<style scoped>
.cgis {
  position: absolute;
  z-index: 2;
  width: 94vw;
  bottom: 0;
  left: 3vw;
  background: white;
  border: 2px solid #e3e3e3;
  border-radius: 10px;
  margin-bottom: 2.5vh;
  text-align: center;
}
.plctitle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6vh;
  font-size: 5vw;
}
.noData {
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2vh;
  padding-top: 1vh;
}
.plcData {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 1vh;
  justify-content: space-around;
}
.eachData {
  margin: 2vw 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.loading {
  margin: 2vh 0;
}
.divider {
  position: absolute;
  left: 0;
  width: 94vw;
  height: 0.1vh;
  background: #409efe;
}
.title {
  padding: 0 2vw 1vh;
}
.content {
  padding: 1vh 2vw 0;
}
</style>>
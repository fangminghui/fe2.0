<template>
  <div class="page">
    <c-gIS :info="info" v-show="show" />
    <div id="mapDiv" class="mapDiv" @click="closeInfo"></div>
    <div class="lable">
      标签
      <Switch v-model="checked" size="20px" inactive-color="#e3e3e3" @click="chengeSwitch" />
    </div>
    <loading v-if="load" size="40px" color="#1989fa" class="app_loading">加载中...</loading>
  </div>
</template>

<script>
import CGIS from "./components/CGIS.vue";
import { Switch } from "vant";
import { Loading } from "vant";
export default {
  components: {
    CGIS,
    Switch,
    Loading,
  },
  mounted() {
    this.load = true;
    this.initMap();
  },

  data() {
    return {
      data: "",
      info: "",
      show: false,
      checked: false,
      load: false,
    };
  },
  methods: {
    initMap() {
      let T = window.T;
      let map = new T.Map("mapDiv", { minZoom: 11 });
      map.centerAndZoom(new T.LngLat(118.16894531249999, 30.128796856732382), 12);
      let bounds = "118.05953,30.21401,118.25032,30.03887".split(",");
      map.setMaxBounds(new T.LngLatBounds(new T.LngLat(bounds[0], bounds[1]), new T.LngLat(bounds[2], bounds[3]))); //初始化地图，设置范围
      /* global T_ANCHOR_BOTTOM_RIGHT */
      let control = new T.Control.Zoom({ position: T_ANCHOR_BOTTOM_RIGHT });
      map.addControl(control);
      let zoom = document.getElementsByClassName("tdt-bottom tdt-right")[0];
      let zoomIn = document.getElementsByClassName("tdt-control-zoom-in")[0];
      let zoomOut = document.getElementsByClassName("tdt-control-zoom-out")[0];
      zoom.style.cssText = "bottom:2vh";
      zoomIn.style.cssText =
        "width:12vw;height:12vw;font-size:10vw;display:flex;align-items:center;justify-content:center;";
      zoomOut.style.cssText =
        "width:12vw;height:12vw;font-size:10vw;display:flex;align-items:center;justify-content:center;";
      // 添加放大缩小控件，设置样式
      this.initData(map, T);
    },
    initData(map, T) {
      let icon = new T.Icon();
      icon.setIconUrl("./mark.svg");
      icon.setIconSize(new T.Point(25, 41));
      this.axios.get("api/gis/marker/list").then((response) => {
        let data = response.data.data;
        this.data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          let marker = new T.Marker(new T.LngLat(data[i].longitude, data[i].latitude)); // 创建标注
          marker.setIcon(icon);
          map.addOverLay(marker);
          let label = new T.Label({
            text: data[i].name,
            position: marker.getLngLat(),
            offset: new T.Point(0, -20),
          });
          map.addOverLay(label);
          label.setBackgroundColor("#eee");
          marker.addEventListener("click", () => {
            this.showInfo(i);
          });
          label.addEventListener("click", () => {
            this.showInfo(i);
          });
        }
      }); //初始化数据和标记

      let ele = document.getElementsByClassName("tdt-overlay-pane")[0];
      let parent = document.createElement("div");
      parent.className = "parent";
      ele.parentNode.replaceChild(parent, ele);
      parent.appendChild(ele);
      parent.style.visibility = "hidden";
      this.initLine(map, T);
    },
    async initLine(map, T) {
      let points = [];
      let line;
      let pipelines;
      await this.axios.get("api/gis/pipe/list").then((response) => {
        pipelines = response.data.data;
        for (let pipeline of pipelines) {
          for (let node of pipeline.nodes) {
            points.push(new T.LngLat(node[1], node[0]));
          }
          line = new T.Polyline(points);
          line.setColor(pipeline.lineColor);
          line.setWeight(pipeline.lineWeight);
          map.addOverLay(line);
          points = [];
        }
      });
      let parent = document.getElementsByClassName("tdt-pane tdt-map-pane")[0];
      let child = document.getElementsByClassName("tdt-overlay-pane")[0].lastElementChild;
      parent.appendChild(child);
      setTimeout(() => (this.load = false), 1000);
    },

    showInfo(i) {
      this.info = this.data[i];
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    closeInfo() {
      this.show = false;
    },
    chengeSwitch() {
      let ele = document.getElementsByClassName("parent")[0];
      if (this.checked) {
        ele.style.visibility = "inherit";
      } else {
        ele.style.visibility = "hidden";
      }
    },
  },
};
</script>

<style scoped>
.mapDiv {
  height: 100vh;
  z-index: 1;
}
.info {
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 10vh;
  background: chartreuse;
  bottom: 0;
}
.lable {
  position: absolute;
  z-index: 2;
  top: 3vw;
  right: 3vw;
  display: flex;
  align-items: center;
}
.app_loading {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 10vh;
  position: fixed;
  top: 0;
  z-index: 3;
  background: #f6f6f6;
}
</style>>
<template>
  <list :finished="true" finished-text="没有更多了">
    <cell>
      <div class="waterCell">
        <div style="color:#323233;">序号</div>
        <div>管线名</div>
      </div>
    </cell>
    <collapse v-model="activeNames">
      <collapse-item v-for="(item,index) in dataList" :key="index">
        <template #title>
          <div class="waterCell">
            <div>{{index+1}}</div>
            <div>{{item.name}}</div>
          </div>
        </template>
        <list class="gislist">
          <div class="gislist">&emsp;&emsp;&emsp;管线长度：{{item.length}}米</div>
          <div class="gislist">&emsp;&emsp;&emsp;管线材质：{{item.texture}}</div>
          <div class="gislist">&emsp;&emsp;&emsp;管径：{{item.diameter}}厘米</div>
          <div class="gislist">&emsp;&emsp;&emsp;厂商：{{item.manufacturer}}</div>
          <div class="gislist">
            &emsp;&emsp;&emsp;管线节点:
            <br />
            <div v-for="(node,indexx) in item.nodes" :key="indexx">
              &emsp;&emsp;&emsp;
              <span class="xuhao">{{indexx+1}}</span>
              &emsp;{{node[1]}}&emsp;/&emsp;{{node[0]}}
            </div>
          </div>
        </list>
      </collapse-item>
    </collapse>
  </list>
</template>
<script>
import { List, Cell, Collapse, CollapseItem } from "vant";
export default {
  components: {
    List,
    Cell,
    Collapse,
    CollapseItem,
  },
  created() {
    this.$emit("loading");
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      dataList: [],
      activeNames: ["0"],
    };
  },
  methods: {
    async getData() {
      await this.axios.get("api/gis/pipe/list").then((res) => {
        let data = res.data.data;
        if (data.length > 0) {
          this.dataList = data;
          this.$emit("finish");
        } else {
          this.$emit("nodata");
        }
      });
    },
  },
};
</script>

<style scoped>
.waterCell {
  display: flex;
  font-size: 4vw;
}
.waterCell > div:first-child {
  flex: 1;
  display: flex;
  justify-content: center;
  color: #1296db;
}
.waterCell > div {
  flex: 3;
  display: flex;
  justify-content: center;
}
.xuhao {
  color: #1296db;
}
.gislist {
  color: black;
}
</style>
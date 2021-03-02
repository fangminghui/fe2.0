<template>
  <div class="cvideo">
    <div class="top">
      <div class="info">{{videoData.cameraName}}</div>
      <!-- <div class="info">监控点名称: {{videoData.cameraTypeName}}</div>
      <div class="info">通道类型: {{videoData.channelTypeName}}</div>
      <div class="info">录像存储位置: {{videoData.recordLocationName}}</div>
      <div class="info">创建时间: {{videoData.createTime.substring(0, 10)}}</div>-->
    </div>
    <div class="bottom">
      <video-player :options="videoOptions" v-if="loading" />
    </div>
  </div>
</template>
<script>
import VideoPlayer from "./CVideoPlayer.vue";
export default {
  components: {
    VideoPlayer,
  },
  props: {
    videoData: Object,
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      loading: false,
      videoOptions: {
        autoplay: false,
        controls: false,
        sources: [
          {
            src: "",
          },
        ],
        preload: "none",
        muted: true,
      },
    };
  },
  methods: {
    getData() {
      let apiPath = "/api/video/v2/cameras/previewURLs";
      let requestBody = { cameraIndexCode: this.videoData.cameraIndexCode, protocol: "hls", streamType: 1 };
      this.axios({
        method: "post",
        url: "api/hikvision/transmission",
        params: {
          apiPath: apiPath,
          requestBody: requestBody,
        },
      }).then((response) => {
        this.videoOptions.sources[0].src = response.data.data.url;
        this.loading = true;
      });
    },
  },
};
</script>

<style scoped>
.cvideo {
  height: 43vh;
  width: 100vw;
  border-bottom: 1px solid #c6c6c6;
}
.top {
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom {
  width: 100vw;
  height: 38vh;
}
.info {
  font-weight: bold;
}
</style>
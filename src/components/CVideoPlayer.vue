<template>
  <div class="aasddsafawse">
    <div class="playButton">
      <img v-if="!playing" @click="play" class="playsvg" src="../assets/svg/play.svg" alt />
    </div>
    <video ref="videoPlayer" class="video-js" poster="../assets/black.png"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      player: null,
      playing: false,
    };
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {});
  },
  unmounted() {
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    play() {
      this.playing = true;
      this.player.play();
    },
  },
};
</script>
<style>
.aasddsafawse {
  padding-left: 5%;
  position: relative;
}
.video-js {
  width: 90vw;
  height: 37vh;
}
.vjs-modal-dialog-content {
  display: none;
}
.playButton {
  position: absolute;
  width: 90vw;
  height: 37vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.playsvg {
  width: 15vw;
}
</style>
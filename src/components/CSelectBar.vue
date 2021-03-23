<template>
  <!-- 标题 -->
  <div class="titles">
    <div v-for="(item, index) in selection" :key="index" class="title" @click="showSelect(index)">
      <span>{{titles[index]}}</span>
      <img src="../assets/svg/arrow.svg" :class="[showSelectIndex === index ? 'top' : 'bottom', 'arrow']" />
    </div>
  </div>
  <div class="content" v-if="showSelectIndex !== -1">
    <!-- select 返回option对象-->
    <div v-if="selection[showSelectIndex].kind === 'select'">
      <div
        v-for="(option, index) in selection[showSelectIndex].options"
        :key="index"
        class="selectDiv"
        @click="select(option)"
      >
        <span>{{ option.text }}</span>
      </div>
    </div>
    <!-- select 返回多个option对象(额外加的功能）-->
    <div v-if="selection[showSelectIndex].kind === 'selects'">
      <div
        v-for="(option, index) in selection[showSelectIndex].options"
        :key="index"
        class="selectDiv"
        @click="selects_select(option)"
      >
        <span>{{ option.text }}</span>
        <img
          v-if="selects_options.indexOf(option.value)!==-1"
          src="../assets/svg/yes.svg"
          style="height:3.5vw;margin-left:2vw;"
        />
      </div>
      <div class="selects_confirm" @click="selects_confirm">确定</div>
    </div>
    <!-- search 返回searchMessage-->
    <div v-else-if="selection[showSelectIndex].kind === 'search'">
      <div class="searchDiv">
        <input class="searchInput" v-model="searchMessage" :placeholder="selection[showSelectIndex].content" />
        <button class="searchButton" @click="search(searchMessage)">
          <img src="../assets/svg/search.svg" alt class="searchSvg" />
          搜索
        </button>
        <button class="resetButton" @click="search('')">重置</button>
      </div>
    </div>
    <!-- time 返回startTime , endTime-->
    <div v-else-if="selection[showSelectIndex].kind === 'time'">
      <div class="searchDiv">
        <div class="timeInput">
          <span class="timeSpan" @click="selectStartTime()">{{formatTime(startTime)}}</span>
          <span>至</span>
          <span class="timeSpan" @click="selectEndTime()">{{formatTime(endTime)}}</span>
        </div>
        <button class="searchButton" @click="selectTime(startTime , endTime)">
          <img src="../assets/svg/search.svg" alt class="searchSvg" />
          搜索
        </button>
        <button class="resetButton" @click="selectTime('','')">重置</button>
      </div>
      <datetime-picker
        v-model="currentDate"
        v-show="showTime"
        :type="dateTimeType"
        :title="showTimeTitle"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="cancelTime"
        @confirm="confirmTime"
      />
    </div>
  </div>
  <div class="masking" v-show="showSelectIndex !== -1" @click="showSelect(-1)" />
</template>

<script>
//通用页面里的下拉选择组件,主要功能就是显示选项，选择回调并显示当前的选择
import { DatetimePicker } from "vant";
export default {
  name: "selectBar",
  props: {
    selection: Array,
    dateTimeType: {
      type: String,
      default: "date",
    },
  },
  components: {
    DatetimePicker,
  },
  created() {
    for (let i = 0; i < this.selection.length; i++) {
      this.titles[i] = this.selection[i].title;
    }
  },
  data() {
    return {
      titles: [], //下拉框标题数组用于展示
      showSelectIndex: -1, //当前展示下拉框序号
      searchMessage: "", //搜索框的内容
      currentDate: new Date(),
      minDate: new Date(2019, 1, 1),
      maxDate: new Date(2025, 1, 1),
      startOrEnd: "",
      startTime: "开始时间",
      endTime: "结束时间",
      showTime: false,
      showTimeTitle: "",
      selects_options: [],
    };
  },
  methods: {
    showSelect(index) {
      if (this.selection[index].kind === "selects" && this.selection[index].options.length === 0) {
        return;
      }
      //传入的index为-1或和当前showSelectIndex一致时关闭，否则打开
      this.showSelectIndex = this.showSelectIndex === index ? -1 : index;
      if (this.showSelectIndex === -1) {
        this.searchMessage = "";
        document.body.removeEventListener("touchmove", this.bodyScroll, {
          passive: false,
        });
      } else {
        document.body.addEventListener("touchmove", this.bodyScroll, {
          passive: false,
        });
      }
    }, //下拉框交互
    cancelTime() {
      this.showTime = false;
    },
    selectStartTime() {
      this.showTime = true;
      this.startOrEnd = "start";
      this.showTimeTitle = "选择开始日期";
    },
    selectEndTime() {
      this.showTime = true;
      this.startOrEnd = "end";
      this.showTimeTitle = "选择结束日期";
    },
    confirmTime(time) {
      if (this.startOrEnd == "start") {
        this.startTime = time;
      } else {
        this.endTime = time;
      }
      this.showTime = false;
    },
    bodyScroll(event) {
      event.preventDefault();
    },
    select(option) {
      this.titles[this.showSelectIndex] = option.text;
      let title = this.selection[this.showSelectIndex].title;
      this.$emit("select", title, option);
      this.showSelectIndex = -1;
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false,
      });
    },
    search(searchMessage) {
      if (!searchMessage.trim()) {
        this.titles[this.showSelectIndex] = this.selection[this.showSelectIndex].title;
      } else {
        this.titles[this.showSelectIndex] = searchMessage;
      }
      let title = this.selection[this.showSelectIndex].title;
      this.$emit("select", title, searchMessage.trim());
      this.showSelectIndex = -1;
      this.searchMessage = "";
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false,
      });
    },
    selectTime(startTime, endTime) {
      let title = this.selection[this.showSelectIndex].title;
      this.$emit("select", title, startTime + "?" + endTime);
      this.showSelectIndex = -1;
      this.startTime = "开始时间";
      this.endTime = "结束时间";
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false,
      });
    },
    selects_select(option) {
      let index = this.selects_options.indexOf(option.value);
      if (index === -1) {
        this.selects_options.push(option.value);
      } else {
        this.selects_options.splice(index, 1);
      }
    },
    selects_confirm() {
      let title = this.selection[this.showSelectIndex].title;
      this.$emit("select", title, this.selects_options);
      this.showSelectIndex = -1;
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false,
      });
    },
    formatTime(time) {
      if (time !== "开始时间" && time !== "结束时间") {
        time = new Date(time);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + "-" + month + "-" + day;
      }
      return time;
    }, //格式化时间的时候跳过初始数据
  },
};
</script>
<style scoped>
.titles {
  width: 100vw;
  display: flex;
  position: relative;
  z-index: 2;
  height: 5vh;
}
.title {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.05vw solid black;
  background: #c2ccd0;
  font-size: 4vw;
  line-height: 4vw;
}
.bottom {
  transform: rotate(-90deg);
}
.top {
  transform: rotate(90deg);
}
.arrow {
  width: 4vw;
  margin-left: 0.5vw;
}
.masking {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #cccccc;
  opacity: 0.5;
  z-index: 1;
}
.content {
  width: 100%;
  background: white;
  position: absolute;
  z-index: 2;
}
.selectDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3vw 0;
  font-size: 4vw;
  line-height: 4vw;
  border-bottom: 0.1vw solid #cccccc;
}
.searchDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3vw 0;
  font-size: 4vw;
  line-height: 4vw;
  border-bottom: 0.1vw solid #cccccc;
}
.searchInput {
  height: 9vw;
  width: 50vw;
  border: 0.1vw solid black;
  border-radius: 0.5vh;
  padding: 1vw;
  box-sizing: border-box;
  margin-right: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.searchButton {
  height: 9vw;
  width: 20vw;
  background: #409efe;
  border: 0.1vw solid #cccccc;
  border-radius: 1vw;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resetButton {
  background: white;
  border-radius: 1vw;
  border: 0;
  color: black;
  display: flex;
  align-items: center;
  margin-left: 2vw;
}
.searchSvg {
  height: 5vw;
  margin-right: 1vw;
}
.van-overlay {
  display: none;
}
.timeInput {
  height: 9vw;
  width: 50vw;
  border: 0.1vw solid black;
  border-radius: 0.5vh;
  padding: 1vw;
  box-sizing: border-box;
  margin-right: 2vw;
  display: flex;
  align-items: center;
}
.timeSpan {
  width: 20vw;
  text-align: center;
  margin: 0 1vw;
  color: #409efe;
}
.selects_confirm {
  height: 9vw;
  width: 100vw;
  background: #409efe;
  border: 0.1vw solid #cccccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.van-picker__cancel,
.van-picker__confirm {
  font-size: 5vw;
  font-weight: bold;
}
</style>
let publicFunc = {
  format(time) {
    if (time !== "开始时间" && time !== "结束时间" && time) {
      time = new Date(time);
      let Y = time.getFullYear();
      let M = time.getMonth() + 1;
      M = M < 10 ? "0" + M : M; // 不够两位补充0
      let D = time.getDate();
      D = D < 10 ? "0" + D : D;
      let H = time.getHours();
      H = H < 10 ? "0" + H : H;
      let Mi = time.getMinutes();
      Mi = Mi < 10 ? "0" + Mi : Mi;
      let S = time.getSeconds();
      S = S < 10 ? "0" + S : S;
      return Y + "-" + M + "-" + D + " " + H + ":" + Mi + ":" + S;
    }
  }, //vant datapicker选择的date转yyyy-MM-dd HH:mm:ss
  getPara(para) {
    let newPara = ''
    for (let key in para) {
      if (para[key] || typeof (para[key]) === 'number') {
        newPara = newPara + '&' + key + '=' + para[key]
      }
    }
    return newPara.replace('&', '')
  },
  async getData(api, para, type = 1) {
    let newPara = this.getPara(para)
    let newApi = api + "?" + newPara
    const response = await axios.get(newApi)
    if (response.data.code === 200) {
      return new Promise((resolve) => {
        let result = type ? response.data.data.resultList : response.data.data
        resolve(result)
      })
    } else {
      return false
    }
  },//成功返回数据，失败返回false
  async getCamera(apiPath, requestBody) {
    return axios({
      method: "post",
      url: "api/hikvision/transmission",
      params: {
        apiPath: apiPath,
        requestBody: requestBody,
      },
    }).then((response) => {
      return response
    })
  },
  //返回的状态错误或者数据集为空，返回false
}
import axios from 'axios';
export default publicFunc

//index.js
//获取应用实例
const map = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data: {
    temp: '',
    weather: '',
    weather_img: '',
    predict : [],
    todayTemp: "",
    todayTime: "",
  },
  onLoad() {
    console.log('Hello World!')
    this.getNow()
  },
  onPullDownRefresh() {
    console.log('refresh')
    this.getNow( ()=> {
        wx.stopPullDownRefresh()
      }
    )
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '广州市',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setToday(result)
        this.setPredict(result)
      },
      complete: ()=> {
        console.log(callback)
        callback && callback()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      temp: temp + '°',
      weather: map[weather],
      weather_img: "/img/" + weather + "-bg.png",
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setPredict(result){
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let predict = []
    for (let i = 0; i < 8; i++) {
      predict.push({
        time: (i * 3 + nowHour) % 24 + "时",
        icon: '/img/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°',
      })
    }
    predict[0].time = "现在"
    this.setData({
      predict: predict
    })
  },
  setToday(result) {
    let date = new Date()
    let temp = result.today
    this.setData({
      todayTemp: temp.maxTemp + '° - ' + temp.minTemp + '°',
      todayTime: date.getFullYear()+ ' - ' + (date.getMonth() + 1) + ' - ' + date.getDate()+ " 今天"
    })
  },
  onDetailTap() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})

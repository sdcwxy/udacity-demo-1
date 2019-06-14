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
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2


Page({
  data: {
    temp: '',
    weather: '',
    weather_img: '',
    predict : [],
    todayTemp: "",
    todayTime: "",
    city: '广州市',
    tip: '点击获取当前位置',
    locationAuthType: UNPROMPTED
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: '申请的key'
    })
    wx.getSetting({
      success: res=>{
        let auth = res.authSetting['scope.userLocation']
        this.setData({
          locationAuthType: auth ? AUTHORIZED
            : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        })
        if (auth)
          this.getLocation()
        else
          this.getNow()
      },
      fail: res=>{
        this.getNow()
      }
    })
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
        city: this.city,
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
      url: '/pages/list/list?city=' + this.data.city,
    })
  },
  onTapLocation() {
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.openSetting({
        success: res=> {
          console.log(res)
          if (res.authSetting['scope.userLocation']){
            this.getLocation()
          }
        }
      })
    else
      this.getLocation()
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
        })
        console.log(res.latitude, res.longitude)
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city,
            })
            this.getNow()
          }
        })
      },
      fail: res => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
        })
      }
    })
  }
})

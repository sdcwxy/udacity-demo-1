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
      complete: ()=> {
        console.log(callback)
        callback && callback()
      }
    })
  }
})

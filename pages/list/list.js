const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Page({
  data: {
    dailyWeather: []
  },
  onLoad() {
    this.getDays()
  },
  onPullDownRefresh(){
    this.getDays(()=> {
      wx.stopPullDownRefresh()
    })
  },
  getDays(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: '广州市',
        time: new Date().getTime()
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res)
        let days = res.data.result
        this.setDays(days)
      },
      complete: ()=> {
        callback && callback()
      }
    })
  },
  setDays(days){
    let dailyWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      dailyWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        icon: '/img/' + days[i].weather + '-icon.png',
        temp: days[i].minTemp + '° - ' + days[i].maxTemp + '°'
      })
    }
    dailyWeather[0].day = '今天'
    this.setData({
      dailyWeather: dailyWeather
    })
  }
})
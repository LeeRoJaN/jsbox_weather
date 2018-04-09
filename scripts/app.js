let cityInfo = {
  name:'',//城市名
  tmp:'',//气温
  aqi:'',//空气质量指数
  qlty:'',//空气质量
  cond_txt:'',//实况天气状况
  cond_code:''
}


function getLocal(){//获取位置
    $location.fetch({
      handler: function(resp) {
        let lat = resp.lat
        let lng = resp.lng
        // var lat = 116.97
        // var lng = 45.52
        getWeather(lat,lng)
      }
    })
}


function getWeather(latt,lngg){//获取天气
    $http.get({
      url: "https://free-api.heweather.com/s6/weather/now?key=f558ebde23d14301b98973697083949e&location="
      +latt+","+lngg+"&lang=zh&unit=m",

      handler: function(resp) {
        let data = resp.data.HeWeather6[0]
        cityInfo.name = data.basic.parent_city//城市名称
        cityInfo.tmp = data.now.tmp//气温
        cityInfo.cond_txt = data.now.cond_txt//天气状况
        cityInfo.cond_code = data.now.cond_code
        getAir(latt,lngg)
      }
    })
}
function getAir(latt,lngg){//获取空气质量相关
    $http.get({
      url: "https://free-api.heweather.com/s6/air?key=f558ebde23d14301b98973697083949e&location="
      +latt+","+lngg+"&lang=zh&unit=m",

      handler: function(resp) {
        let data = resp.data.HeWeather6[0]
        cityInfo.aqi = data.air_now_city.aqi//空气质量指数
        cityInfo.qlty = data.air_now_city.qlty//空气质量
        showView()
      }
    })
}
function showView() {
  $ui.render({
    props: {
      title: cityInfo.name
    },
    views: [{
      type: "list",
      props: {
        data:[
            {
          image: {
            src: 'assets/'+cityInfo.cond_code+'.png'
          },
          name: {
            text: cityInfo.name
          },
          tmp: {
            text: cityInfo.tmp+'°'
          },
          txt: {
            text: cityInfo.cond_txt
          },
          qlty: {
            text: "空气质量："+cityInfo.qlty
          },
        }],
        rowHeight: 140,
        separatorHidden:true,
        selectable:false,
        template: [{
            type: "image",
            props: {
              id: "image",
              bgcolor: $rgba(100, 100, 100, 0),
            },
            layout: function(make, view) {
              make.left.equalTo(20)
              make.width.equalTo(100)
            }
          },
          {
            type: "label",
            props: {
              id: "name",
              font: $font("bold", 18),
              lines: 1
            },
            layout: function(make) {
              make.left.equalTo($("image").right).offset(50)
              make.top.equalTo(20)
            }
          },
          {
            type: "label",
            props: {
              id: "tmp",
              font: $font(44),
              lines: 1,
            },
            layout: function(make) {
              make.left.equalTo($("image").right).offset(170)
              make.top.equalTo(22)
            }
          },
          {
            type: "label",
            props: {
              id: "txt",
              font: $font(12),
              lines: 1,
            },
            layout: function(make) {
              make.left.equalTo($("name"))
              make.top.equalTo($("name").bottom).offset(5)

            }
          },
          {
            type: "label",
            props: {
              id: "qlty",
              font: $font(12),
              lines: 1,
            },
            layout: function(make) {
              make.left.equalTo($("txt"))
              make.top.equalTo($("txt").bottom).offset(5)
            }
          },
        ]
      },
      layout: $layout.fill,
    }]
  })
}

module.exports = {
  getLocal: getLocal
}


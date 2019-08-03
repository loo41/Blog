module.exports =  {
  // 首页 logo 展示数据
  github: 'https://github.com/loo41',
  email: 'lovelife@tcyong.com.cn',
  qq: '1805170243',
  // 输入框默认值
  title: 'TCYong | Blog',
  // 是否其他作者发布的文章是否展示, 更具 user.name 做对比
  author: true,
  // 背景图数组，随机展示
  bg_img: [
    require('./src/assets/index_bg.jpg'),
    require('./src/assets/index_bg2.jpg'),
    require('./src/assets/index_bg3.jpg'),
    require('./src/assets/index_bg4.jpg'),
    require('./src/assets/index_bg5.jpg')
  ],
  // 登陆 github 相关信息
  user: {
    name: "loo41",
    repo: "Blog",
    client_id: '248302c725b74ef60d01',
    client_secret: 'ae5338311e2f36cd2b45fc0aa2e8cac9e9cc707f'
  },
}
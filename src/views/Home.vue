<template>
  <div class="home">
    <Header></Header>
    <div class="main-body">
      <div class="main box">
        <div class="body-main">
          <transition-group name="list-transition">
            <div v-for="(item, index) in article" v-show="Config.author || (!Config.author && item.user.login == Config.user.name)" ref="articleItem" :key="index + 'article'" class="main-article">
              <div class="article-box">
                <div class="article-title" @click="viewContent(index)">
                  {{item.title}}
                </div>
                <div class="article-label" v-show="item.labels && item.labels.length">
                  <span v-for="(label, i) in item.labels" :key="i + 'labels'" class="label location-label">{{label.name}}</span>
                </div>
                <div class="article-info">
                  <div><img title="作者" src="../svg/zuozhe.svg" class="icons" /> <div>{{item.user && item.user.login}}</div></div>
                  <div v-if="item.comments"><img title="评论" src="../svg/pinglun.svg" class="icons" /> <div>{{item.comments}}</div></div>
                  <div><img title="时间" src="../svg/shijian.svg" class="icons" /> <div>{{formatTime(item.created_at)}}</div></div>
                  <div><a :href="item.html_url" target="view_window"><img title="链接地址" src="../svg/lianjie.svg" class="icons" /></a></div>
                </div>
                <div class="underline"></div>
              </div>
            </div>
          </transition-group>
          <div v-if="(!article.length && page !== 1) || !isData" class="no-data">
            <img src="../svg/nodata.svg" /> 没有找到文章
          </div>
          <div class="more-box">
            <div v-show="page !== 1" @click="proPage"><img src="../svg/pre.svg" />   PRO</div>
            <div></div>
            <div @click="nextPage" v-show="isData">NEXT   <img src="../svg/next.svg" /></div>
          </div>
        </div>
        <div class="body-sidebar">
          <div>
            <datepicker :inline="true" wrapper-class="calendar" calendar-class="calendar" :language="zh" :value="selected"></datepicker> 
          </div>
          <div class="sidebar-box">
            <div class="sidebar-title">标签</div>
            <div class="labels" v-show="labels.length">
              <span v-for="(label, i) in labels" :key="i + 'label'" :class="selectLabel === label? 'select-label label': 'label'" @click="setLabel(label)">{{label}}</span>
            </div>
          </div>
          <div class="sidebar-box">
            <Author></Author>
          </div>
        </div>
      </div>
    </div> 
    <Footer></Footer>
    <div id="appScreen" v-if="m">
       <div id="appScreen_box">
         <vuc-material :output="output" class="appScreen-material">
         </vuc-material>
         <div class="appScreen-info">移动端正在开发中，请期待</div>
       </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import Footer from '../components/Footer'
import Author from '../components/Author'
import Datepicker from 'vuejs-datepicker'
import { vucMaterial } from 'vuc-material'
import { zh } from 'vuejs-datepicker/dist/locale'
import { mapActions, mapState } from 'vuex'
import Config from '../../blog.config'
export default {
  name: 'home',
  data: () => ({
    selected: new Date(),
    zh: zh,
    page: 1,
    Config: Config,
    selectLabel: '',
    offset: [],
    timer: {},
    output: 'background',
    isScroll: true,
    isIeBrowser: false,
    scrollTop: 0,
    m: false,
    info: {
      H: 0,
      W: 0
    },
    screenMv: {
      pageY: 0,
      relativeY: 0
    }
  }),
  components: {
    Header,
    Footer,
    Author,
    Datepicker,
    vucMaterial
  },
  computed: mapState(['labels', 'article', 'isData', 'searchIndex']),
  watch: {
    searchIndex (newValue, oldValue) {
      if (oldValue === newValue && oldValue) return
      let scrollTop = this.isIeBrowser? window.pageYOffset: document.documentElement.scrollTop || document.body.scrollTop
      this.setScroll(scrollTop, this.offset[newValue])
    }
  },
  created () {
    this.getData({page: this.page, per_page: 10})
    this.setEvent()
  },
  mounted () {
    this.isBrowser()
    this.isM()
    this.info.H = document.documentElement.clientHeight
    this.info.W = document.documentElement.clientWidth
    this.$nextTick(() => {
      this.countTop()
      if (this.m) this.newScreen()
    })
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.sendEvent)
    next()
  },
  methods: {
    ...mapActions(['getData']),
    isM () {
      let sUserAgent = navigator.userAgent.toLowerCase()
      let bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
      let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
      let bIsMidp = sUserAgent.match(/midp/i) == "midp"
      let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
      let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
      let bIsAndroid = sUserAgent.match(/android/i) == "android"
      let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
      let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"
  
      if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        this.m = false
      } else {
        this.m = true
      }
    },
    countTop () {
      const count = () => {
        setTimeout(() => {
          if (!this.$refs.articleItem) return count()
          this.offset = this.$refs.articleItem.map((item) => {
            return item.offsetTop
          })
        }, 20);
      }
      count()
    },
    setEvent () {
      let that = this
      this.scrollEvent = window.addEventListener('scroll', that.sendEvent)
    },
    sendEvent (e) {
      let that = this
      if (!this.isScroll) return
      if(that.timer) clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        if (!e || !that.offset.length) return
        let scrollTop = this.isIeBrowser? window.pageYOffset: document.documentElement.scrollTop || document.body.scrollTop
        that.suckUp(scrollTop)
      }, 500)
    },
    isBrowser () {
      let userAgent = navigator.userAgent
      this.isIeBrowser = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
    },
    suckUp (pageY) {
      if (pageY > this.offset[this.offset.length - 1] || pageY < this.offset[0]) return
      let offset, flag = true
      this.offset.forEach((item, index) => {
        if (item >= pageY && flag) {
          if (this.offset[index - 1] && (this.offset[index - 1] + ((item - this.offset[index - 1]) / 2)) > pageY) {
            offset = index - 1
          } else {
            offset = index
          }
          flag = false
        }
      })
      this.setScroll(pageY, this.offset[offset])
    },
    setScroll (pageY, offset) {
      this.isScroll = false
      let scroll, i = 0
      if (offset > pageY) {
        scroll = setInterval(() => {
          if (offset <= pageY) {
            this.setScrollTop(offset)
            i = 0
            setTimeout(() => this.isScroll = true, 500)
            return clearInterval(scroll)
          }
          pageY += i
          this.setScrollTop(pageY)
          i += 1
        }, 10)
      } else {
        scroll = setInterval(() => {
          if (offset >= pageY) {
            this.setScrollTop(offset)
            i = 0
            setTimeout(() => this.isScroll = true, 500)
            return clearInterval(scroll)
          }
          pageY -= i
          this.setScrollTop(pageY)
          i += 1
        }, 10)
      }
    },
    setScrollTop (scroll_top) {
      document.documentElement.scrollTop = scroll_top
      window.pageYOffset = scroll_top
      document.body.scrollTop = scroll_top
    },
    formatTime (time) {
      if (!time) return ''
      let date = new Date(time)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    proPage () {
      if (this.page === 1) return
      this.page -= 1
      let options = {page: this.page, per_page: 10}
      if (this.selectLabel) options.labels = this.selectLabel
      this.getData(options).then(() => {
        this.countTop()
      })
    },
    nextPage () {
      if (!this.article.length) return
      this.page += 1
      let options = {page: this.page, per_page: 10}
      if (this.selectLabel) options.labels = this.selectLabel
      this.getData(options).then(() => {
        this.countTop()
      })
    },
    setLabel (label) {
      this.page = 1
      if (this.selectLabel === label) {
        this.getData({page: this.page, per_page: 10}).then(() => {
          this.countTop()
        })
        return this.selectLabel = ''
      }
      this.getData({page: this.page, per_page: 10, labels: label}).then(() => {
        this.countTop()
      })
      this.selectLabel = label
    },
    viewContent (index) {
      this.$router.push({path: '/view', query: { index }})
    },
    getID (id) {
      return document.getElementById(id)
    },
    getClass (classN) {
      return document.getElementsByClassName(classN)
    },
    selectFun (select) {
      return document.querySelector(select)
    },
    tagName (father ,tag) {
      return father.getElementsByTagName(tag)
    },
    newScreen () {
      if(document.documentElement.clientWidth <= 1024) {
        this.appScreen = this.getID('appScreen')
        this.selectFun('.box').style.position = 'fixed'
        this.appScreen.style.cssText = `height: ${this.info.H}px; width: ${this.info.W}px; display: block!important;`
        let appScreen_box = this.getID('appScreen_box')
        appScreen_box.style.cssText = `height: ${this.info.H}px; width: ${this.info.W}px;`
        addEventListener('touchmove', (event) => { this.touchMove(event) }, false)
        addEventListener('touchstart', (event) => { this.touchStart(event) }, false)
        addEventListener('touchend', (event) => { this.touchEnd(event) }, false)
      } else {
        return null
      }
    },
    touchMove (event) {
      if (this.notMove) return
      let Y = event.targetTouches[0].pageY
      this.screenMv.relativeY = Y - this.screenMv.pageY
      this.appScreen.style.top = `${this.screenMv.relativeY}px`
      if (parseInt(this.appScreen.style.top) >= 0) {
        this.appScreen.style.top = '0px'
        return
      }
    },
    touchStart (event) {
      if (this.notMove) return
      this.screenMv.pageY = event.targetTouches[0].pageY
    },
    touchEnd () {
      if (this.notMove) return
      if (parseInt(this.appScreen.style.top) <= -2) {
        this.notMove = true
        this.appScreen.style.transform = `translate3d(0px, -${this.info.H}px, 0px)`
        setInterval(() => {
          document.removeEventListener('touchmove', this, false)
          document.removeEventListener('touchstart', this, false)
          document.removeEventListener('touchend', this, false)
          this.selectFun('#appScreen').style.display = 'none'
          this.selectFun('.box').style.position =  'absolute'
        }, 1000)
    } else {
        return
      }
    }
  }
}
</script>
<style scope>
.main-body {
  box-sizing: border-box;
  width: 1024px;
  margin: 20px auto;
}
.main {
  height: 100%;
  width: 100%;
  display: flex;
}
.body-main {
  flex: 1;
  margin-right: 20px;
}
.body-label {
  width: 20%;
  margin-left: 5px;
}
.main-article {
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.article-box {
  height: 100%!important;
  position: relative;
  width: 100%;
  transition:all .9s linear;
  border-bottom: 1px solid #EBEEF5;
}
.underline {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 1;
  background: #D1D1D1;
  transform: scaleX(0);
}
.article-box:hover .underline{
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  bottom: 0;
  z-index: 2;
  background: #E4E7ED;
  transform: scaleX(0);
  transition: transform 1s;
  transform: scaleX(1)
}
.article-title {
  min-height: 40px;
  font-size: 20px;
  font-size: #303133;
  display: flex;
  cursor: pointer;
}
.article-title:hover {
  color: #C0C4CC
}
.article-info {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px!important;
  color: #606266
}
.article-info div {
  display: flex;
  padding-right: 20px;
}
.article-info div div{
  box-sizing: border-box;
  padding: 0 10px;
  display: flex;
  color: #909399;
  font-size: 14px;
  align-items: center;
}
.article-label {
  padding: 10px 0;
  display: flex;
  color: #C0C4CC
}
.label {
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid #EBEEF5;
  transition: all .5s ease;
  cursor: pointer;
}
.location-label {
  margin-left: 10px;
}
.location-label:first-child {
  margin-left: 0
}
.label:hover {
  transform: scale(1.2)
}
.body-sidebar {
  width: 30%;
  padding: 10px;
  box-sizing: border-box;
}
.labels {
  display: flex;
  flex-wrap: wrap;
}
.labels span {
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
  transition: all .5s ease;
}
.labels span:hover {
  transform: scale(1.3)
}
.sidebar-title {
  line-height: 80px;
  font-size: 20px;
  display: flex;
}
.sidebar-box {
  padding-bottom: 20px;
  border-bottom: 1px solid #F2F6FC
}
.sidebar-box:first-child {
  margin-top: 0
}
.icons {
  height: 18px;
}
.calendar {
  width: 100%!important
}
.selected {
  background: #F2F6FC!important;
}
.more-box {
  height: 50px;
  padding: 10px;
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.more-box div {
  display: flex;
  align-items: center;
  white-space: pre;
  cursor: pointer;
  color: #303133
}
.list-transition {
  display: inline-block;
  margin-right: 10px;
}
.list-transition-enter-active, .list-transition-leave-active {
  transition: all 1s;
}
.list-transition-enter, .list-transition-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
.no-data {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #606266;
}
.select-label {
  background: #E4E7ED;
}
.display-pc {
  display: none;
}
#appScreen {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  background-color: #C0C4CC;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 1s;
}
#appScreen_box {
  position: relative;
}
.appScreen-material {
  position: absolute;
}
.appScreen-info {
  position: absolute;
  background: rgba(255, 255, 255, .3);
  z-index: 1000;
  top: 50%;
  left: 50%;
  font-size: 25px;
  color: #606266;
  letter-spacing: 1px;
  border-radius: 5px;
  padding: 60px;
  transform: translateX(-50%) translateY(-50%)
}
</style>


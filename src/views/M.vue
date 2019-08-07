<template>
  <div class="box">
    <div id="appScreen">
       <div id="appScreen_box">
          <Author/>
          <div class="title">{{Config.title}}</div>
       </div>
    </div>
    <m-header :openClose="openClose" :labelShow="labelShow" />
    <div class="content-box" v-show="pageShow">
      <transition name="label">
        <div class="labels-box" v-if="labelShow">
          <div class="labels-list" v-show="labels.length">
            <span v-for="(label, i) in labels" :key="i + 'label'" :class="selectLabel === label? 'select-labels labels': 'labels'" @click="setLabel(label)">{{label}}</span>
          </div>
        </div>
      </transition>
      <div class="list-boxs">
        <transition-group name="list-transition">
          <div v-for="(item, index) in article" v-show="Config.author || (!Config.author && item.user.login == Config.user.name)" ref="articleItem" :key="index + 'article'" class="main-article">
            <div class="article-boxs">
              <div class="article-m-title" @click="viewContent(index)">
                <p>{{item.title}}</p>
              </div>
              <div class="article-m-label" v-show="item.labels && item.labels.length">
                <span v-for="(label, i) in item.labels" :key="i + 'labels'" class="m-label location-m-label">{{label.name}}</span>
              </div>
              <div class="article-m-info">
                <div><img title="作者" src="../svg/zuozhe.svg" class="icons" /> <div>{{item.user && item.user.login}}</div></div>
                <div v-if="item.comments"><img title="评论" src="../svg/pinglun.svg" class="icons" /> <div>{{item.comments}}</div></div>
                <div><img title="时间" src="../svg/shijian.svg" class="icons" /> <div>{{formatTime(item.created_at)}}</div></div>
                <div><a :href="item.html_url" target="view_window"><img title="链接地址" src="../svg/lianjie.svg" class="icons" /></a></div>
              </div>
            </div>
          </div>
          <div v-if="(!article.length && page !== 1) || !isData" class="no-data" key="noData">
            <img src="../svg/nodata.svg" /> 没有找到文章
          </div>
        </transition-group>
        <div class="more-m-box">
          <div v-show="page !== 1" @click="proPage">
            <touch-ripple :speed="1" :opacity="0.3" color="#C0C4CC" transition="ease" class="item" >
              <div><img src="../svg/pre.svg" class="icons"/>   PRO</div>
            </touch-ripple>
          </div>
          <div v-show="page === 1"></div>
          <div @click="nextPage" v-show="isData">
            <touch-ripple :speed="1" :opacity="0.3" color="#C0C4CC" transition="ease" class="item" >
              <div class="next-icon">NEXT   <img src="../svg/next.svg" class="icons" /></div>
            </touch-ripple>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Author from '../components/Author'
import Config from '../../blog.config'
import MHeader from '../components/M-Header'
import { mapActions, mapState } from 'vuex'
export default {
  data: () => ({
    info: {
      H: 0,
      W: 0
    },
    page: 1,
    screenMv: {
      pageY: 0,
      relativeY: 0
    },
    pageShow: false,
    Config: Config,
    labelShow: false,
    selectLabel: ''
  }),
  components: {
    Author,
    MHeader
  },
  created () {
    this.getData({page: this.page, per_page: 10})
  },
  computed: {
    ...mapState(['userInfo', 'labels', 'article', 'isData'])
  },
  mounted () {
    this.info.H = document.documentElement.clientHeight
    this.info.W = document.documentElement.clientWidth
    this.$nextTick(() => {
      this.newScreen()
    })
  },
  methods: {
    ...mapActions(['getData']),
    viewContent (index) {
      this.$router.push({path: '/m-view', query: { index }})
    },
    openClose () {
      if (this.labelShow) return this.labelShow = false
      this.labelShow = true 
    },
    setLabel (label) {
      this.labelShow = false
      this.page = 1
      if (this.selectLabel === label) {
        this.getData({page: this.page, per_page: 10}).then(() => {})
        return this.selectLabel = ''
      }
      this.getData({page: this.page, per_page: 10, labels: label}).then(() => {})
      this.selectLabel = label
    },
    proPage () {
      if (this.page === 1) return
      this.page -= 1
      let options = {page: this.page, per_page: 10}
      if (this.selectLabel) options.labels = this.selectLabel
      this.getData(options).then(() => {})
    },
    nextPage () {
      if (!this.article.length) return
      this.page += 1
      let options = {page: this.page, per_page: 10}
      if (this.selectLabel) options.labels = this.selectLabel
      this.getData(options).then(() => {})
    },
    getID (id) {
      return document.getElementById(id)
    },
    formatTime (time) {
      if (!time) return ''
      let date = new Date(time)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
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
        this.pageShow = true
        this.notMove = true
        this.appScreen.style.transform = `translate3d(0px, -${this.info.H}px, 0px)`
        setTimeout(() => {
          document.removeEventListener('touchmove', this, false)
          document.removeEventListener('touchstart', this, false)
          document.removeEventListener('touchend', this, false)
          this.selectFun('#appScreen').style.display = 'none'
        }, 1000)
    } else {
        return
      }
    }
  }
}
</script>

<style scope>
.box {
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding-top: 12vw;
}
#appScreen {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 1s;
  background: linear-gradient(61deg, #909399 10%, #C0C4CC 20%, #C0C4CC 30%, #E4E7ED 40%, #EBEEF5 50%, #ffffff 0)
}
#appScreen_box {
  position: relative;
  box-sizing: border-box;
  padding: 10% 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.title {
  line-height: 100px;
  text-align: center;
  font-size: 25px
}
.avatar {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  transition:all 2s linear;
}
.content-box {
  height: 100%;
  position: relative;
}
.list-boxs {
  height: 100%;
  width: 100%;
}
.labels-box {
  position: fixed;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 5vw;
  background: white;
  z-index: 10
}
.label-enter-to {
  transform: translateY(0%);
  opacity: 1;
}
.label-enter-active {
  transition: all 1s ease;
}
.label-enter, .label-leave-to {
  transform: translateY(100%);
  opacity: 0.5;
}
.label-enter-to {
  transition: all 1s ease;
  transform: translateY(0%);
  opacity: 1;
}
.labels-list {
  display: flex;
  flex-wrap: wrap;
}
.labels {
  padding: 2vw 5vw;
  border-radius: 5vw;
  margin-left: 2vw;
  margin-top: 2vw;
  border: 1px solid #EBEEF5;
  transition: all .5s ease;
  font-size: 4vw;
  cursor: pointer;
}
.select-labels {
  background: #E4E7ED;
}
.article-boxs {
  min-height: 20vw!important;
  background: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, .2);
  box-sizing: border-box;
  padding: 5vw;
  border-radius: 2vw;
  overflow: hidden;
}
.article-m-title {
  min-height: 10vw;
  display: flex;
  cursor: pointer;
}
.article-m-title p {
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
  font-size: 6vw;
  font-size: #303133;
}
.article-m-info {
  min-height: 10vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap; 
  color: #606266
}
.article-m-info div {
  display: flex;
  padding-right: 5vw;
}
.article-m-info div div{
  box-sizing: border-box;
  padding: 0 2vw;
  display: flex;
  color: #909399;
  font-size: 4vw;
  align-items: center;
}
.article-m-label {
  padding: 3vw 0;
  display: flex;
  flex-wrap: wrap;
  color: #C0C4CC
}
.m-label {
  padding: 2vw 5vw;
  border-radius: 10vw;
  border: 1px solid #EBEEF5;
  transition: all .5s ease;
  font-size: 3vw;
  cursor: pointer;
}
.m-label:hover {
  transform: scale(1.2)
}
.location-m-label {
  margin-left: 2vw;
  margin-top: 2vw
}
.icons {
  height: 4vw;
}
.more-m-box {
  height: 20vw;
  padding: 10px;
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.more-m-box div {
  flex: 1;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  white-space: pre;
  cursor: pointer;
  font-size: 4vw;
  color: #303133
}
.next-icon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.no-data {
  font-size: 3vw;
  height: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

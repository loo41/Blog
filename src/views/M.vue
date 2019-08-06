<template>
  <div class="box">
    <div id="appScreen">
       <div id="appScreen_box">
          <Author/>
          <div class="title">{{Config.title}}</div>
       </div>
    </div>
    <header class="header">
      <div class="header-info">
        <div>
          <img v-show="userInfo.avatar_url" :src="userInfo.avatar_url" class="avatar" />
        </div>
        <div>{{userInfo.name}}</div>
      </div>
      <div class="header-label"></div>
    </header>
  </div>
</template>

<script>
import Author from '../components/Author'
import Config from '../../blog.config'
import { mapState } from 'vuex'
export default {
  data: () => ({
    info: {
      H: 0,
      W: 0
    },
    screenMv: {
      pageY: 0,
      relativeY: 0
    },
    Config: Config
  }),
  components: {
    Author
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted () {
    this.info.H = document.documentElement.clientHeight
    this.info.W = document.documentElement.clientWidth
    this.$nextTick(() => {
      this.newScreen()
    })
  },
  methods: {
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
  position: absolute;
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
.header {
  height: 12vw;
  background: white;
  display: flex;
  justify-content: space-between;
  position: fixed;
  box-shadow: 0 0 2px rgba(0, 0, 0, .2);
  top: 0
}
.header-info {
  flex: 1;
  box-sizing: border-box;
  padding: 0 2vw;
  display: flex;
}
.header-info div:nth-child(1) {
  height: 100%;
  width: 14vw;
  box-sizing: border-box;
  padding: 2vw;
  border-radius: 50%;
  padding-right: 4vw;
}
.header-label {
  width: 14vw;
  box-sizing: border-box;
  padding-right: 2vw;
}
.avatar {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  transition:all 2s linear;
}
</style>

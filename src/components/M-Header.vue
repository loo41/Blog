<template>
  <header class="header">
    <div class="header-info">
      <div>
        <img v-show="userInfo.avatar_url" :src="userInfo.avatar_url" class="avatar" />
      </div>
      <div>{{userInfo.name}}</div>
    </div>
    <div class="header-label" @click="openClose" v-show="$route.path === '/mobile'">
      <touch-ripple :speed="1" :opacity="0.3" color="#C0C4CC" transition="ease" class="item" >
        <img src="../svg/biaoqian.svg" class="icons" v-show="!labelShow"/>
        <img src="../svg/guanbi.svg" class="icons" v-show="labelShow" />
      </touch-ripple>
    </div>
    <div class="header-label" v-show="$route.path !== '/mobile'" @click="goHome">
      <touch-ripple :speed="1" :opacity="0.3" color="#C0C4CC" transition="ease" class="item" >
        <img src="../svg/index.svg" class="icons" />
      </touch-ripple>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapState(['userInfo'])
  },
  props: {
    openClose: {
      type: Function,
      default: () => {}
    },
    labelShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setScrollTop (scroll_top) {
      document.documentElement.scrollTop = scroll_top
      window.pageYOffset = scroll_top
      document.body.scrollTop = scroll_top
    },
    goHome () {
      this.setScrollTop(0)
      this.$router.push('/mobile')
    }
  }
}
</script>

<style>
.header {
  height: 12vw;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
  position: fixed;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  top: 0;
  z-index: 10
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
.header-info div:nth-child(2) {
  font-size: 5vw;
  line-height: 12vw;
}
.header-label {
  width: 14vw;
  box-sizing: border-box;
  padding-right: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-label div {
  border-radius: 50%;
  overflow: hidden;
}
.icons {
  height: 4vw;
}
</style>

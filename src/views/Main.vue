<template>
  <div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isRun: true
  }),
  created () {
    this.isRun = false
    this.isM()
    this.isRun = true
  },
  activated () {
    if (!this.isRun) return
    this.isM()
  },
  methods: {
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
        this.$router.push('/pc')
      } else {
        this.$router.push('/mobile')
      }
    }
  }
}
</script>

<style>

</style>

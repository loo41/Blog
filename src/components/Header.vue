<template>
  <div class="header">
    <div class="header-bg">
      <vuc-picture-contrast :type="type" :img="[img]" :W="W" :H="500" :pro="pro" :dir="dir" />
    </div>
    <slider-bar />
    <div class="header-search-box" v-show="$route.path === '/pc'">
      <vucInput 
        type="arc"
        className="search"
        :H="150"
        :W="700"
        :padding="50"
        :size="7"
        :help-text="Config.title"
        v-model="searchValue"
        @change="searchChange"
        :color="color"
      />
    </div>
    <div class="header-search-box" v-show="$route.path === '/view'">
      {{title}}
    </div>
  </div>
</template>

<script>
import SliderBar from './SliderBar'
import { mapState, mapMutations  } from 'vuex'
import Config from '../../blog.config'
export default {
  data: () => ({
    searchValue: '',
    dir: 'top',
    img: Config.bg_img[Math.floor(Math.random() * Config.bg_img.length)],
    pro: [0, 0],
    Config: Config,
    type: ['blur', 'blackWhite', 'prints', 'blur', 'cameo'][Math.floor(Math.random() * 6)],
    W: 0,
    color: ['#C0C4CC', '#909399', '#606266', '#303133', '#DCDFE6', '#E4E7ED', '#EBEEF5', '#F2F6FC', '#000000', '#FFFFFF']
  }),
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.getScreenSize()
  },
  components: { SliderBar },
  computed: mapState(['article']),
  methods: {
    ...mapMutations(['setSearchIndex']),
    getScreenSize () {
      this.W = document.body.clientWidth
      this.pro = [this.W / 2, 250]
    },
    searchChange () {
      if (!this.searchValue) return
      let i = 0
      let flag = null
      this.article.forEach((item, index) => {
        let match = new RegExp(this.searchValue.split('').join('|'), 'ig')
        let matchInfo = item.title.match(match)
        if (matchInfo && matchInfo.length > i) {
          flag = index
        }
      })
      if (!flag && flag != 0) return
      this.setSearchIndex(flag)
    }
  }
}
</script>

<style scope>
.header {
  position: relative;
  height: 500px;
  background: #909399;
  width: 100%;
}
.header-search-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 6;
  font-size: 26px;
  color: white;
  letter-spacing: 2px;
}
.search {
  background: rgba(255, 255, 255, .4);
  color: white;
  border: 6px #DCDFE6 dotted!important;
}
input::-webkit-input-placeholder{
  color:white;
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
  color:white;
}
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
  color:white;
}
input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
  color:white;
}
</style>

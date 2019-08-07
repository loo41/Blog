<template>
  <div class="container">
    <m-header />
    <main>
      <div class="title">
        {{title}}
      </div>
      <div>
        <div class="content markdown-body">
          <div v-html="content" class="markdown-content"></div>
        </div>
        <div class="next-pro">
          <div v-if="article[Number(index) - 1]" @click="preRouter"><img src="../svg/prex.svg" class="icons" />     <p>{{article[Number(index) - 1].title}}</p></div>
          <div v-if="!article[Number(index) - 1]"></div>
          <div v-if="!article[Number(index) + 1]"></div>
          <div v-if="article[Number(index) + 1]" @click="nextRouter" ><p>{{article[Number(index) + 1].title}}</p>     <img src="../svg/next.svg" class="icons" /></div>
        </div>
        <div class="talk-container" ref="gitalkContainer">
          <div id="gitalk-container" class="gitalk" ref="gitalk"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import MHeader from '../components/M-Header'
import { mapState } from 'vuex'
import 'gitalk/dist/gitalk.css'
import Config from '../../blog.config'
import Gitalk from 'gitalk'
export default {
  data: () => ({
    title: '',
    content: '',
    index: 0,
    gitalkLife: null,
    Config: Config
  }),
  components: {
    MHeader
  },
  activated () {
    this.setData()
  },
  computed: mapState(['article']),
  methods: {
    setData () {
      const { index } = this.$route.query
      this.hash = location.hash.slice(2).split('&')[0]
      this.index = Number(index)
      this.renderData()
    },
    renderData () {
      let index = this.index
      this.title = this.article[index].title
      this.content = this.article[index].body_html
      this.setTalk()
    },
    general_ids() {
      for (let i = 1; i <= 6; i++) {
        let headers = this.$refs.markdownBody.querySelectorAll('h' + i)
        headers.forEach((v, index) => {
          v.id = this.hash + '&h_' + i + '_' + index
        })
      }
    },
    setTalk () {
      this.gitalkLife = new Gitalk({
        clientID: Config.user.client_id,
        clientSecret: Config.user.client_secret,
        repo: Config.user.repo,
        admin: Config.user.name,
        owner: Config.user.name,
        id: location.href,
        number: this.article[this.index].number,
        distractionFreeMode: false
      })
      if (this.gitalkLife && this.$refs.gitalkContainer) {
        let dom = document.querySelector('#gitalk-container')
        if (dom) this.$refs.gitalkContainer.removeChild(dom)
        let node = document.createElement('div')
        node.id = 'gitalk-container'
        node.className = 'gitalk'
        this.$refs.gitalkContainer.appendChild(node)
      }
      setTimeout(() => this.gitalkLife.render('gitalk-container'), 100)
    },
    setScrollTop (scroll_top) {
      document.documentElement.scrollTop = scroll_top
      window.pageYOffset = scroll_top
      document.body.scrollTop = scroll_top
    },
    preRouter () {
      this.index -= 1
      this.$router.push({path: '/m-view', query: { index: this.index }})
      this.setScrollTop(0)
      this.$nextTick(() => {
        this.setData()
      })
    },
    nextRouter () {
      this.index += 1
      this.$router.push({path: '/m-view', query: { index: this.index }})
      this.setScrollTop(0)
      this.$nextTick(() => {
        this.setData()
      })
    }
  }
}
</script>

<style>
.title {
  box-sizing: border-box;
  padding: 10vw;
  line-height: 10vw;
  color: #303133;
  font-size: 7vw;
  border-bottom: 1px solid #F2F6FC;
}
.content {
  box-sizing: border-box;
  padding: 3vw;
}
.container {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding-top: 12vw;
}
#gitalk-container {
  box-sizing: border-box;
  padding: 3vw;
}
.next-pro {
  display: flex;
  min-height: 10vw;
  box-sizing: border-box;
  padding: 10px;
}
.next-pro div {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  flex-wrap: wrap;
  white-space: pre;
  font-size: 4vw;
}
.next-pro div p {
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.icons {
  height: 4vw;
} 
</style>

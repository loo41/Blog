<template>
  <div>
    <Header :title="title"/>
    <div class="main markdown-body" ref="markdownBody">
      <div class="markdown-content"><div v-html="content"></div></div>
      <div id="toc" ref="toc">
        <div class="gitalk-toc toc"></div>
      </div>
    </div>
    <div class="router">
      <div @click="preRouter" v-if="article[Number(index) - 1]"><img src="../svg/prex.svg" />     {{article[Number(index) - 1].title}}</div>
      <div v-if="!article[Number(index) - 1]"></div>
      <div v-if="!article[Number(index) + 1]"></div>
      <div @click="nextRouter" v-if="article[Number(index) + 1]">{{article[Number(index) + 1].title}}     <img src="../svg/next.svg" /></div>
    </div>
    <div class="talk-container" ref="gitalkContainer">
      <div id="gitalk-container" class="gitalk" ref="gitalk"></div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import 'gitalk/dist/gitalk.css'
import Config from '../../blog.config'
import Gitalk from 'gitalk'
import { mapState } from 'vuex'
import tocbot from 'tocbot'
export default {
  data: () => ({
    title: '',
    content: '',
    index: 0,
    gitalkLife: null
  }),
  components: { Header },
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
      if (this.$refs.markdownBody) {
        tocbot.destroy()
        if (this.$refs.toc) {
          this.$refs.toc.removeChild(
            document.querySelector('.gitalk-toc')
          )
          let node = document.createElement('div')
          node.className = 'gitalk-toc toc'
          this.$refs.toc.appendChild(node)
        }
        this.$nextTick(() => {
          this.general_ids()
          tocbot.init({
            tocSelector: '.gitalk-toc',
            contentSelector: '.markdown-body',
            headingSelector: 'h1, h2, h3'
          })
          tocbot.refresh()
        })
      }
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
        this.$refs.gitalkContainer.removeChild(
          document.querySelector('#gitalk-container')
        )
        let node = document.createElement('div')
        node.id = 'gitalk-container'
        node.className = 'gitalk'
        this.$refs.gitalkContainer.appendChild(node)
      }
      setTimeout(() => this.gitalkLife.render('gitalk-container'), 100)
    },
    preRouter () {
      this.index -= 1
      this.$router.push({path: '/view', query: { index: this.index }})
      tocbot.destroy()
      this.$nextTick(() => {
        this.setData()
      })
    },
    nextRouter () {
      this.index += 1
      this.$router.push({path: '/view', query: { index: this.index }})
      tocbot.destroy()
      this.$nextTick(() => {
        this.setData()
      })
    }
  }
}
</script>

<style scope>
.main {
  width: 1000px;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
}
.gitalk {
  width: 1000px;
  margin: 0 auto;
}
.gt-container .gt-comment-header {
  display: flex;
  align-items: center;
}
.router {
  width: 1000px;
  line-height: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.router div {
  font-size: 18px;
  display: flex;
  align-items: center;
  white-space: pre;
  cursor: pointer;
  color: #909399
}
.router div:hover {
  color: #606266;
}
.gt-container .gt-comment-body {
  display: flex;
}
.talk-container {
  margin-bottom: 50px;
}
.markdown-content {
  width: 800px;
}
#toc {
  width: 20%;
  margin-left: 20px;
}
.toc {
  position: -webkit-sticky;
  position: sticky;
  top: 4rem;
  overflow-y: hidden;
}
.toc > .toc-list {
  overflow: hidden;
}
.toc > .toc-list li {
  list-style: none;
}
.toc-list {
  margin: 0;
  padding-left: 10px;
}
a.toc-link {
  color: currentColor;
  height: 100%;
}
.is-collapsible {
  max-height: 1000px;
  overflow: hidden;
  transition: all 300ms ease-in-out;
}

.is-collapsed {
  max-height: 0;
}

.is-active-link {
  font-weight: 700;
}

.toc-link::before {
  background-color: #EEE;
  content: ' ';
  display: inline-block;
  height: inherit;
  left: 0;
  margin-top: -1px;
  position: absolute;
  width: 2px;
}
.is-active-link::before {
  background-color: #008B8B;
}
.toc-icon {
  position: fixed;
  top: 0;
  right: 0;
}
</style>

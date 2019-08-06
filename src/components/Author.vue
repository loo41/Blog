<template>
  <div>
    <div>
      <div class="avatar-box">
        <div class="avatar_box">
          <img v-show="userInfo.avatar_url" :src="userInfo.avatar_url" class="avatar" />
        </div>
      </div>
      <div class="name" :style="color? 'color: white': ''">{{userInfo.name}}</div>
      <div class="logo" :style="color? 'color: white': ''">{{userInfo.login}}</div>
      <div class="bio" :style="color? 'color: white': ''">{{userInfo.bio}}</div>
      <div v-if="userInfo.blog"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  props: {
    color: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style>
.avatar-box {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar_box {
  height: 100px;
  width: 100px;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 50%;
  border: 1px solid #EBEEF5;
  overflow: hidden;
}
.avatar {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  transition:all 2s linear;
}
.avatar:hover {
  transform: scale(1.2) rotate(360deg)
}
.name {
  line-height: 30px;
  text-align: center;
  font-size: 25px;
  color: #303133;
}
.logo {
  line-height: 30px;
  font-size: 20px;
  text-align: center;
  color: #606266;
}
.bio {
  line-height: 20px;
  font-size: 16px;
  text-align: center;
  color: #909399
}
</style>

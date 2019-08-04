<template>
  <div id="app">
    <transition name="page">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.page-enter-to {
  transform: translate(0%);
  opacity: 1;
}
.page-enter-active {
  transition: all 1s ease;
}
.page-enter, .page-leave-to {
  transform: translate(100%);
  opacity: 0.5;
}
.page-enter-to {
  transform: translate(0%);
  opacity: 1;
}
</style>

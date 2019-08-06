<template>
  <div class="container">
    <m-header />
  </div>
</template>

<script>
import MHeader from '../components/M-Header'
export default {
  data: () => ({}),
  components: {
    MHeader
  }
}
</script>

<style>
.container {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding-top: 12vw;
}
</style>

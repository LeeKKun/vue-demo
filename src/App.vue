<template>
  <!-- 实际上, 这里配置的就是 组件对象的 template 属性 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

</script>

<style lang="less">
#app {
  .box {
    width: 200px;
    height: 200px;
    background: pink;
  }
}
</style>

<template>
  <!-- 实际上, 这里配置的就是 组件对象的 template 属性 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
</script>

<style lang="less">
body,
html,
#app {
  width: 100%;
  height: 100%;
    .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c5c5;
    margin-bottom: 10px;
  }
}
</style>

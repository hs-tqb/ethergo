<style lang="less">
  @import url(~assets/css/variables.less);
  #__nuxt, #__layout, .page-root, .page-container { height:100%; }
  body { background:rgba(0,0,0,0.5); }
  #__default {
  }
</style>

<template>
  <div id="__default" class="page-root">
    <!-- <bet /> -->
    <nuxt class="page-container" :data-page="$route.name"/>
  </div>
</template>

<script>
import bet from '~/components/bet'
export default {
  components: { bet }
}
</script>

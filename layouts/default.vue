<style lang="less">
  @import url(~assets/css/variables.less);
  #__nuxt, #__layout, .page-root, .page-container { height:100%; }
  body { background:rgba(0,0,0,0.5); }
  // #__default {
  // }

  @import url(~assets/css/icons/success.less);
  @import url(~assets/css/icons/failure.less);
  .dialog-container { 
    position:fixed; top:0; left:0; z-index:1000; width:100vw; height:100%; 
    background-color: rgba(0,0,0,.7);
    transition-duration:300ms;
    pointer-events:none; opacity:0;
    &.show { pointer-events:auto; opacity:1; }
  }
  #dialog-message {
    .flow; align-items:center; justify-content:center;
    background-color:transparent;
    &.show{ pointer-events:none; }
    .inner-wrapper { 
      display:inline-block;
      margin-top:-150px;
      padding:14px; 
      max-width:70%;
      line-height:1.4;
      text-align:justify;
      color:#fff;
      background:rgba(51,51,51,.9) no-repeat center 12px;
      background-size:30px auto ; 
      box-shadow:0 0 3px 1px #777;
      border-radius:8px; 
      
      &[data-type] {
        padding-top:50px;
        &:empty { background-position:center 10px; padding-bottom:0; }
        min-width:50px;
        text-align:center;
      }
      &[data-type=success] { background-image:url(@icon-success); }
      &[data-type=failure] { background-image:url(@icon-failure); }
    }
  }
</style>

<template>
  <div id="__default" class="page-root">
    <!-- <bet /> -->
    <nuxt class="page-container" :data-page="$route.name"/>
    <!-- 全局消息弹窗 -->
    <div id="dialog-message" class="dialog-container" :class="messageDialog.show?'show':''">
      <div class="inner-wrapper" :data-type="messageDialog.type||''" v-if="messageDialog.html" v-html="messageDialog.html"></div>
      <div class="inner-wrapper" :data-type="messageDialog.type||''" v-else>{{messageDialog.text}}</div>
    </div>
  </div>
</template>

<script>
import bet from '~/components/bet'
export default {
  components: { bet },
  computed: {
    messageDialog() {
      return this.$store.state.messageDialog
    }
  },
  mounted() {
    // console.log( process.env.NODE_ENV )
    if ( process.env.NODE_ENV === 'development' ) {
      let script = document.createElement('script');
      script.onload = function() { eruda.init(); }
      document.body.appendChild(script)
      script.src = '//cdn.bootcss.com/eruda/1.4.2/eruda.min.js'
    }
  }
}
</script>

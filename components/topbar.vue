<style lang="less">
  @import url(~assets/css/variables.less);
  // 顶栏
  #comp-topbar { 
    // .flow; justify-content:space-between; align-items:center;  
    // #logo   {  }
    #account-info { 
      // width:50%; 
      margin-top:5px;
      text-align:right; font-size:12px;
      #address { margin-bottom:3px; }
    }
  }
</style>

<template>
  <div id="comp-topbar" class="comp-container panel">
    <img src="" alt="logo">
    <div id="account-info">
      <h4 id="address">钱包: {{account.address}}</h4>
      <h4 id="balance">余额: {{account.balance}} ETH</h4>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    account() {
      return this.$store.state.account;
    }
  }
}
</script>


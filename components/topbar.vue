<style lang="less">
  @import url(~assets/css/variables.less);
  // 顶栏
  #topbar { 
    // .flow; justify-content:space-between; align-items:center;  
    // #logo   {  }
    padding:0 20px;
    #account-info { 
      margin-top:5px; text-align:right; font-size:12px; cursor:pointer;
      #address { margin-bottom:3px; }
    }
    #logo-wrapper {
      font-weight:bold; line-height:50px; font-size:30px; color:@color-warning;
    }
  }
</style>

<template>
  <div id="topbar" class="panel">
    <div id="logo-wrapper" @click="toggleMenu">
      <!-- <img src="" alt="logo"> -->
      ETHERWOW
    </div>
    <div id="account-info" @click="getAccountDetail">
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
    },
  },
  methods: {
    getAccountDetail() {
      location.href = (`https://etherscan.io/address/${this.account.address}`)
    },
    toggleMenu() {
      this.$store.commit('toggleMenu', !this.$store.state.showMenu);
    },
  }
}
</script>


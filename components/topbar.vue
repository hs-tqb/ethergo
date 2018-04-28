<style lang="less">
  @import url(~assets/css/variables.less);
  // 顶栏
  #topbar { 
    // .flow; justify-content:space-between; align-items:center;  
    // #logo   {  }
    padding:0 20px;
    #account-info {
      text-align:right; font-size:12px; cursor:pointer;
      // #address { margin-bottom:3px; }
      h4 { margin-bottom:3px; }
    }
    #logo-wrapper {
      font-weight:bold; line-height:50px; font-size:30px; color:@color-warning;
    }
  }
  @media screen and (max-width:412px) {
    #topbar { position:fixed; top:0; left:0; z-index:100; width:100%; background:#777; }
    .page-container { padding-top:90px; }
  }
  @media screen and (min-width:412px) {
    #topbar {
      .flow(row);
      #logo-wrapper { flex:1; }
      #account-info { .flow; justify-content:center;  }
    }
  }
</style>

<template>
  <div id="topbar" class="panel">
    <div id="logo-wrapper" @click="toggleMenu">
      <!-- <img src="" alt="logo"> -->
      ETHERWOW
    </div>
    <div id="account-info" @click="getAccountDetail" :style="`opacity:${account.address?1:0}`">
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


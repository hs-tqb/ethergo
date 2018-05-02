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
      #address a { 
        color:inherit; 
        &:hover { color:@color-primary-light-2; }
      }
      #pendingWithdrawal {
        position:relative;
        .bubble { 
          &::before { position: absolute; right:0; top:0; height:0; border:6px solid red; content:'\200B'; }
          position:absolute; right:0; top:40px; color:#666;
          padding:15px;
          background-color:#fff; .radius;
        }
      }
    }
    #logo-wrapper {
      font-weight:bold; line-height:50px; font-size:30px; color:@color-warning; cursor:pointer;
    }
  }
  @media screen and (max-width:412px) {
    #topbar { 
      position:fixed; top:0; left:0; z-index:100; width:100%; background:#777; 
      .page-container { padding-top:95px; }
      // &.acc-available   + .page-container { padding-top:95px; }
      // &.acc-unavailable + .page-container { padding-top:70px; }
    }
  }
  @media screen and (min-width:412px) {
    #topbar {
      .flow(row); justify-content:space-between;
      // #logo-wrapper { flex:1; }
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
    <div id="account-info" v-show="account.loaded">
      <template v-if="account.address" class="hasAddress">
        <h4 id="address"><a :href="`https://etherscan.io/address/${account.address}`">钱包: {{account.address}}</a></h4>
        <h4 id="balance">余额: {{account.balance}} ETH</span></h4>
        <h4 id="pendingWithdrawal" v-if="!!account.pendingWithdrawal">
          <a href="#withdraw" class="text-warning">待提现金额: {{account.pendingWithdrawal}} ETH</a>
          <!-- <div class="bubble">1231</div> -->
        </h4>
      </template>
      <template v-else>
        <h4 class="" style="text-align:left">请安装
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">metamask</a> 插件或使用 
          <a href="https://www.cmcmbc.com/zh-cn/dapp-browser/" target="_blank">dapp</a> 浏览器访问</h4>
      </template>
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
  },
  mounted() {

  }
}
</script>


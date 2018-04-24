<style lang="less">
  @import url(~assets/css/variables.less);
  #page-home {
    h2 { margin-bottom:15px; font-size:40px; }
    h3 { margin:10px 0; }
    h5 { font-size:12px; }
    .panel { padding:5px 10px; }

    // 顶栏
    #topbar { 
      // .flow; justify-content:space-between; align-items:center;  
      #logo   {  }
      #account-info { 
        // width:50%; 
        margin-top:5px;
        text-align:right; font-size:12px;
        #address { margin-bottom:3px; }
      }
    }
    // 赌注
    #panel-bet {
      .selection { 
        .flow(row); .flow(row); height:40px; line-height:40px; align-items:stretch;
        .preview { padding:0 10px; min-width:70px; font-size:26px; text-align:center; color:@color-primary; background-color:#fff; .radius; }
        .preview + * { flex:1; }
      }
      & > div { margin-bottom:20px; }
      #wager {
        .selection { 
          .list { 
            flex:1; .flow(row); margin-left:10px;
            li { 
              padding:0 10px; .radius; 
              &.selected { background-color:@color-primary-light-1; }
            }
          }
        }
        .condition { margin:10px 0; font-size:12px; color:@color-text-placeholder; }
      }
      #range {
        margin-bottom:40px;
        .selection {
          .supp-info {
            position:absolute; left:0; top:100%; line-height:25px; font-size:12px; color:#fff; 
          }
          .preview { position:relative; }
          .preview::after { position:absolute; right:5px; font-size:10px; content:'%'; }
          div { 
            position:relative; display:flex; align-items:center;  margin:0 15px 0 20px; 
            input { 
              width:100%;  height:15px; background:transparent; background:url(~assets/img/range-background.svg) no-repeat center/ 100% auto; .radius; cursor:pointer; -webkit-appearance:none; 
              &::-webkit-slider-thumb {
                width:16px; height:28px; 
                -webkit-appearance:none;
                .radius(10px);
                // border:10px solid transparent;
                border:0 none;
                background-color:@color-primary-light-1;
                // box-shadow:0 1px 1px #def3f8, inset 0 .125em .125em #0d1112;
              }
            }
            ul { 
              .flow(row); position:relative; width:100%; font-size:10px;
              li { position:absolute; top:0; bottom:0; transform:translate3d(-50%,0,0); }
            }
          }
        }
      }
      #roll {
        line-height:20px;
        h2 {
          span { font-size:60px; }
          line-height:60px; 
        }
        span { float:right; color:@color-success; }
        p.info { 
          font-size:12px; color:@color-text-placeholder; 
          span { font-size:16px; color:@color-danger; }
        }
      }
    }
    // 投注
    #panel-roll {
      text-align:center;
      .number-block { font-size:100px; }
      .inner-panel { 
        margin:0 40px;
        padding:30px 0px;
        &:first-child { .border(bottom); }
        h3 { margin:10px 0 20px 0; }
      }
      .btn { margin-top:20px; }
    }
  }
</style>

<template>
  <div id="page-home">
    <div id="topbar" class="panel">
      <img src="" alt="logo">
      <div id="account-info">
        <h4 id="address">钱包: {{account.address}}</h4>
        <h4 id="balance">余额: {{account.balance}} ETH</h4>
      </div>
    </div>

    <div id="panel-bet" class="panel" v-if="roll.state==='ready'">
      <div id="amount">
        <!-- <h2>立刻投注</h2> -->
        <h3>立刻投注</h3>
        <div id="wager">
          <div class="selection">
            <p class="preview">{{computedWager}}</p>
            <ul class="list">
              <li 
              v-for="(s,i) in bet.wager.list" 
              @click="selectBetWager(i)"
              :class="i===bet.wager.selected?'selected':''"
              >{{s.name}}</li>
            </ul>
          </div>
          <div class="condition">
            <p>Min bet size {{bet.wager.list[0].value}} ETH</p>
            <p>Max profit {{bet.profit.max}} ETH</p>
          </div>
        </div>
      </div>
      <div id="range">
        <h3>胜率大小</h3>
        <div class="selection">
          <p class="preview">
            {{bet.range.value}}
            <span class="supp-info">min change</span>
          </p>
          <div>
            <input type="range" 
            :min="bet.range.min" 
            :max="bet.range.max" 
            v-model="bet.range.value"
            >
            <ul class="signs supp-info">
              <li v-for="i in 5" :style="`left:${(i-1)*25}%;`" @click="setRange(i)">
                {{(i-1)*25}}%
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="roll">
        <h2>押注结果小于 <span>{{+bet.range.value+1}}</span></h2>
        <!-- <h3>押注结果小于 <span>{{+bet.range.value+1}}</span></h3> -->
        <p>投注数 <span>{{computedWager}} ETH&nbsp;</span></p>
        <p>赢钱数 <span>{{computedUserProfit}} ETH&nbsp;</span></p>
        <p class="info">commission: {{1}}% 
          <span v-if="!rollable">(已超过最大赢钱数，请重新选择)</span>
        </p>
      </div>
      <input type="button" class="btn primary block" value="投注" :disabled="!rollable" @click="doRoll">
    </div>

    <div id="panel-roll" class="panel" v-else-if="roll.state==='roll'">
      <div class="inner-panel">
        <h3>结果小于</h3>
        <p class="number-block">{{+bet.range.value+1}}</p>
      </div>
      <div class="inner-panel">
        <h3>投注结果</h3>
        <p class="number-block">
          <!-- {{roll.result}} -->
          <template v-if="roll.result">{{roll.result}}</template>
          <template v-else>
            <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
          </template>
        </p>
      </div>
      <input type="button" class="btn primary block" :value="`你${roll.result>+bet.range.value?'输了':'赢了'}, 再玩一次`" v-if="roll.result" @click="backToRoll">
    </div>

    <div id="panel-guide" class="panel" v-show="false">
      <h2>怎么玩</h2>
      <ul class="anchors">
        <li><a href="#guide-game">Play the game</a></li>
        <li><a href="#guide-metamask">Play using metamask</a></li>
        <li><a href="#guide-browser">Play using mist browser</a></li>
        <li><a href="#guide-mobile">Play using your mobile</a></li>
        <li><a href="#guide-tips">Hot Tips</a></li>
      </ul>
      <div id="guide-game">
        <h3>Play the game</h3>
        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        <ol>
          <li>1111111111111111111</li>
          <li>2222222222222</li>
          <li>333333333333333333333</li>
          <li>444444444444444444444</li>
          <li>555555555555555555</li>
        </ol>
      </div>
      <div id="guide-metamask">
        <h3>Play the metamask</h3>
        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        <ol>
          <li>1111111111111111111</li>
          <li>2222222222222</li>
          <li>333333333333333333333</li>
          <li>444444444444444444444</li>
          <li>555555555555555555</li>
        </ol>
      </div>
      <div id="guide-browser">
        <h3>Play the browser</h3>
        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        <ol>
          <li>1111111111111111111</li>
          <li>2222222222222</li>
          <li>333333333333333333333</li>
          <li>444444444444444444444</li>
          <li>555555555555555555</li>
        </ol>
      </div>
    </div>
    
    <!-- 记录 -->
    <div id="panel-record" class="panel" v-show="false">
      <ul>
        <!-- <li v-for="(r,i) in record.all" :key="`r-a-${i}`">{{r}}</li> -->
      </ul>
    </div>
    <!-- 提现 -->
    <!-- <div id="panel-withdraw" class="panel">
      <input type="button" class="btn primary" @click="doWithdraw" value="提现">
    </div> -->
  </div>
</template>

<script>
import abi from '~/assets/js/abi'
import Web3 from 'web3'
export default {
  data() {
    return {
      web3:undefined,
      // 账户
      account :{},
      // 合约
      contract:{
        abi:abi,
        address:'0xb22c9b68edfa6fd124cfedb0d5ad49d363c14146',
        instance:null,
      },
      // 投注记录
      record: {
        user:[],
        all:[]
      },
      // 赌注设置
      bet: {
        wager: {
          selected:0,
          list:[
            {name:'MIN', value:0.1},
            {name:'0.1', value:0.1},
            {name:'0.3', value:0.3},
            {name:'0.5', value:0.5},
            {name:'0.7', value:0.7},
            {name:'1.0', value:1.0},
          ],
        },
        range: {
          min:1,
          max:98,
          value:50
        },
        roll: {
          value:51,
        },
        profit: {
          max:0,
          reqTimer:-1,
          reqDelay:400
        }
      },
      // 投注状态
      roll: {
        state:'ready',
        result:undefined,
      },
    }
  },
  computed: {
    computedWager() {
      return this.bet.wager.list[this.bet.wager.selected].value;
    },
    computedUserProfit() {
      let { wager, range, roll, profit } = this.bet;
      if ( !profit.max ) return 0;
      return ((((this.computedWager * (100-(range.value))) / (range.value)+this.computedWager))*990/1000)-this.computedWager;
    },
    rollable() {
      return this.computedUserProfit <= this.bet.profit.max;
    }
  },
  methods: {
    // --------- 功能 ---------
    // 初始化 web3
    initWeb3() {
      this.web3 = typeof web3 !== 'undefined'? 
        new Web3(web3.currentProvider):
        new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    },
    // 获取账户信息
    async getAccountInfo() {
      let vm = this;
      // 获取钱包地址
      let address = await new Promise((resolve,reject)=>{
        this.web3.eth.getAccounts((error, result)=>{
          if ( error ) reject(error)
          else if ( !result.length ) reject('没找到账户信息');
          resolve(result)
        })
      })
      .then(result=>{
        console.warn(`钱包地址: ${result[0]}`)
        return result[0];
      })
      .catch(this.commonErrorCatcher);

      // 获取余额 (单位 wei)
      let wei = await new Promise((resolve,reject)=>{
        this.web3.eth.getBalance(address, 'latest', (err,result)=>{
          if ( err ) reject(err)
          resolve(result)
        })
      })
      .then(result=>{
        // 返回的是一个bigNumber对象, 需要获取bigNumber对应的数(单位是wei), 再将wei转成eth
        console.warn(`余额: ${ result.toNumber() } (wei)`)
        return result.toNumber()
      })
      .catch(this.commonErrorCatcher.bind({}))

      // 余额 (单位 eth)
      let balance = this.web3.fromWei( wei );
      console.warn(`余额: ${balance} (eth)`)

      this.account = { address, wei, balance };
    },
    // 获取合约
    getContract() {
      return this.contract.instance? 
        this.contract.instance:
        ( this.contract.instance=this.web3.eth.contract(this.contract.abi).at(this.contract.address) );
    },
    // 获取投注记录
    async getRecord() {
      let obj = { all:[], user:[] }
      if ( !this.checkAccountValid() ) return obj;
      // 获取当前的区块数
      let blockNumber   = await new Promise((resolve, reject)=>{
        this.web3.eth.getBlockNumber((err, result)=>{
          if (err) reject();
          resolve(result);
        });
      })
      .catch(this.commonErrorCatcher);
      
      // 估计n天的区块数, (假设一分钟上链10个)
      let dayBlockNumber = (60*24*10) * 1;

      // 获取合约
      let contract = this.getContract();

      // 通过合约获取记录
      let temp = []
      let all  = [], user = []

      await new Promise((resolve,reject)=>{
        contract
          .LogBet(
            { _userAddress: '' }, 
            { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
          )
          .watch((err,result)=>{
            if ( err ) reject(err)
            temp.push( result );
            resolve(result)
          })
      })
      .catch(this.commonErrorCatcher);


      all = temp.map(c=>{
        return c;
      });
      user = all.filter(c=>{
        return c.args.UserAddress === this.account.address;
      })

      this.record = { all, user };
    },
    // 获取待提现金额
    async getPendingWithdrawal() {
      this.account.pendingWithdrawal = await new Promise((resolve,reject)=>{this
        .getContract()
        .userGetPendingTxByAddress(this.account.address, (err,result)=>{
          if ( err ) reject(err)
          console.warn(`未提现: ${ result.toNumber() }`)
          resolve(result.toNumber())
        })
      })
      .catch(this.commonErrorCatcher);
    },
    // 提现
    doWithdraw() {
      let contract = this.getContract();
      contract.userWithdrawPendingTransactions((err, result)=>{
        console.log(err || result);
      })
      // console.log( this.contract.abi )
    },

    //--------- 检测 ---------
    // 检测账户有效性, 默认会显示错误提示(如果有)
    checkAccountValid(showWarning=true) {
      let warning = '';
      if ( !this.web3 ) {
        warning = 'web3 / metamask 加载失败, 请刷新重试'
      }
      else if ( !this.account.address ) {
        warning = '钱包获取失败, 请确认已经登录'
      }
      // else if ( !this.getContract() ) {
      //   warning = '合约获取失败';
      // }

      showWarning && warning && console.error(warning);

      return !warning;
    },
    // 检查合约可用
    checkContractAvailable(showWarning=true) {
      let warning = '';
      if ( !this.getContract() ) {
        warning = '合约获取失败';
      }

      showWarning && warning && console.error(warning);
      return !warning;
    },
    // 检测余额可用
    checkBalanceAvailae(n) {
      let warning = '';
      if ( isNaN(this.account.balance) ) {
        warning = '余额加载失败, 请刷新页面重试'
      }
      else if ( this.account.balance < n ) {
        warning = '余额不足'
      }

      warning && console.error(warning);

      return !warning;
    },

    // --------- 其它 ---------
    // 通用的catcher
    commonErrorCatcher(err) {
      console.error( err.toString() )
    },

    // --------- bet ----------
    // 选择价格
    selectBetWager(idx) {
      this.bet.wager.selected = idx;
    },
    setRange(idx) {
      let temp = ((idx-1)*25);
      if ( temp === 0 ) temp = this.bet.range.min;
      else if ( temp === 100 ) temp = this.bet.range.max
      this.bet.range.value = temp;
    },
    getUserMaxProfit() {
      let profit = this.bet.profit;
      clearTimeout( profit.reqTimer );
      profit.reqTimer = setTimeout(()=>{
        let contract = this.getContract();
        let temp = contract.maxProfit((err,result)=>{
          if ( err ) return this.commonErrorCatcher(err);
          profit.max = this.web3.fromWei(result.toNumber());
          console.warn(`最大用户收益: ${profit.max}`);
        });
      }, profit.reqDelay);
    },
    doRoll() {
      if ( !this.checkAccountValid() ) return;
      
      // 支付参数
      let additionParam = {
          from: this.account.address,
          to: this.contract.address,
          value: this.web3.toWei( this.computedWager ),
          gas: 3000000,
          gasPrice: 200000000000
      };

      // 投注
      let contract = this.getContract();
      contract.userRollDice(98, additionParam, (err, hash)=>{
        if ( err ) console.error(err.toString());
        let LogBet = contract.LogBet();
        // 
        this.roll.state = 'roll';
        // 投注支付监控
        LogBet.watch((err, result)=>{
          if ( err ) console.error(error.toString());
          console.log( result )
          LogBet.stopWatching();
          // 
          // this.roll.state = 'roll';
          // this.roll.result= undefined;
        })
        // 投注结果监控
        let LogResult = contract.LogResult();
        LogResult.watch((err, result)=>{
          if ( err ) console.error(error.toString());
          LogResult.stopWatching();
          this.roll.result = result.args.DiceResult.toNumber()
        })
      })
    },
    backToRoll() {
      this.roll.state = 'ready';
      this.roll.result= undefined;
    }
    // --------- bet ----------
    // --------- bet ----------
    // --------- bet ----------
  },
  // 初始化 环境 和 账户信息
  async mounted() {
    this.initWeb3();
    this.getAccountInfo();
    this.getUserMaxProfit();
    // console.log( Object.keys(this.web3) );
    // this.getPendingWithdrawal();
    // this.getRecord();
    
    // this.account = await this.getAccountInfo();
    // this.account.pendingWithdrawal = await this.getPendingWithdrawal();
    // this.record  = await this.getRecord();
  }
}
</script>

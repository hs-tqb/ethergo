<style lang="less">
  @import url(~assets/css/variables.less);
  #page-home {
    h2 { margin-bottom:15px; font-size:40px; }
    h3 { margin:10px 0; }
    h5 { font-size:12px; }
    .panel { padding:5px 10px; }
    .btn.block { height:52px; font-size:22px; }
    // 顶栏
    #topbar { 
      // .flow; justify-content:space-between; align-items:center;  
      // #logo   {  }
      #account-info { 
        // width:50%; 
        margin-top:5px;
        text-align:right; font-size:12px;
        #address { margin-bottom:3px; }
      }
    }
    // 赌注
    #panel-bet {
      .flow; justify-content:space-around; min-height: calc( 100% - 58px ); 
      .selection { 
        .flow(row); .flow(row); height:40px; line-height:40px; align-items:stretch;
        .preview { padding:0 10px; min-width:70px; font-size:26px; text-align:center; color:@color-primary; background-color:#fff; .radius; }
        .preview + * { flex:1; }
      }
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
      #compensate {
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
      .flow; min-height: calc( 100% - 58px ); text-align:center;
      .border { margin:0 30px; }
      .number-block { font-size:100px; }
      .inner-panel { 
        h3 { margin:10px 0 20px 0; }
      }
      .btn { margin-bottom:20px; }
    }
    // 历史
    #panel-record {
      // li { .border(bottom); }
      table { width:100%; }
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
    <!-- 赌注 -->
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
              :key="`wager${i}`"
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
              <li v-for="i in 5" :key="`range${i}`" :style="`left:${(i-1)*25}%;`" @click="setRange(i)">
                {{(i-1)*25}}%
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="compensate">
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
    <!-- 开奖 -->
    <div id="panel-roll" class="panel" v-else-if="roll.state==='roll'">
      <div class="filler"></div>
      <div class="inner-panel">
        <h3>结果小于</h3>
        <p class="number-block">{{+bet.range.value+1}}</p>
      </div>
      <div class="filler"></div>
      <div class="border"></div>
      <div class="filler"></div>
      <div class="inner-panel">
        <h3>投注结果</h3>
        <p class="number-block">
          <!-- {{roll.result}} -->
          <template v-if="typeof roll.result !=='number'">
            <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
          </template>
          <template v-else-if="roll.result<3">{{roll.value}}</template>
        </p>
        <p class="tips" v-if="roll.result">
          <span v-if="roll.result===0" class="text-danger">你输了</span>
          <span v-else-if="roll.result===1" class="text-success">你赢了</span>
          <span v-else-if="roll.result===2" class="text-warning">打款失败, 请手动提现</span>
          <span v-else-if="roll.result===3" class="text-warning">投注失败, 已退款</span>
          <span v-else-if="roll.result===4" class="text-warning">投注失败, 请手动提现</span>
        </p>
      </div>
      <div class="filler"></div>
      <input type="button" 
        class="btn primary block"
        v-if="roll.result"
        @click="backToRoll"
        value="再玩一次" 
      >
      <span v-else style="height:50px;"></span>
    </div>
    <!-- 引导 -->
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
    <div id="panel-record" class="panel" v-show="true">
      <div class="tabs"> all </div>
      <table>
        <thead>
          <tr>
            <td>开奖数字</td>
            <td>投注数字</td>
            <td>用户收益</td>
            <td>其它</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r,i) in record[record.show]" :key="`r-a-${i}`">
            <td>{{ r.DiceResult.toNumber() }}</td>
            <td>{{ r.UserNumber.toNumber() }}</td>
            <td>{{ r.computedProfit }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
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
        show:'all',
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
        result:'',
        value:undefined,
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

      console.log('______________________blockNumber', blockNumber)
      
      // 估计n天的区块数, (假设一分钟上链10个)
      let dayBlockNumber = (60*24*10) * 1;

      // 获取合约
      let contract = this.getContract();

      console.log('______________________contract', contract)

      // 通过合约获取记录
      let LogBet, ResultBet, bets = [], results = []
      // 需要结合两个记录
      await Promise.all([
        new Promise((resolve,reject)=>{
          LogBet = contract.LogBet(
            { _userAddress: '' }, 
            { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
          );
          LogBet.watch((err,result)=>{
            if ( err ) reject(err)
            bets.push( result );
            resolve(result)
          })
        }).catch(this.commonErrorCatcher),
        new Promise((resolve,reject)=>{
          ResultBet = contract.LogResult(
            { _userAddress: '' }, 
            { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
          );
          ResultBet.watch((err,result)=>{
            if ( err ) reject(err)
            results.push( result );
            resolve(result)
          });
        }).catch(this.commonErrorCatcher)
      ])
      LogBet.stopWatching();
      ResultBet.stopWatching();

      console.log('______________________bets', bets)
      console.log('______________________results', results)
      
      

      this.record.all = bets.map(b=>{
        let r  = results.filter(r=>r.args.BetID===b.args.BetID)[0] || {args:{}};
        let o = { ...b.args, ...r.args};
        o.computedProfit = this.computeProfit( o );
        return o;
      }).reverse();
      this.record.user = this.record.all.filter(r=>r.UserAddress===this.account.address)

      console.log('______________________record', this.record)
      
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
    // 投注
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
      contract.userRollDice(+this.bet.range.value+1, additionParam, (err, hash)=>{
        if ( err ) return console.error(err.toString());
        let LogBet = contract.LogBet();
        // 
        this.roll.state = 'roll';
        // 投注支付监控
        LogBet.watch((err, result)=>{
          if ( err ) console.error(error.toString());
          // console.log( result )
          console.warn('支付成功');
          // this.record.all.push({})
          // this.record.user.push(result.args)
          LogBet.stopWatching();
          // 刷新账户
          this.getAccountInfo();
        })
        // 投注结果监控
        let LogResult = contract.LogResult();
        LogResult.watch((err, result)=>{
          if ( err ) console.error(error.toString());
          LogResult.stopWatching();
          // this.roll.result = result.args.DiceResult.toNumber()
          console.log('______________jieguo');
          console.log( result )
          console.log('______________jieguo');
          this.roll.result = result.args.Status.toNumber()
          this.roll.value  = result.args.DiceResult.toNumber()
          console.log( this.roll )
        })
      })
    },
    // 返回
    backToRoll() {
      this.roll.state  = 'ready';
      this.roll.result = '';
      this.roll.value  = undefined
    },
    // --------- record ----------
    computeProfit(r) {
      console.log('_______________record');
      console.log(r);
      console.log('_______________record');
      // 如果还没出结果
      if ( !r.DiceResult ) {
        r.DiceResult = { toNumber(){ return '等待开奖'; } }
        return '等待开奖';
      }
      return this.web3.fromWei(r.DiceResult.toNumber()<r.UserNumber.toNumber()?
                r.ProfitValue.toNumber():
                -r.BetValue.toNumber());
    },
    // --------- bet ----------
    // --------- bet ----------
  },
  // 初始化 环境 和 账户信息
  async mounted() {
    this.initWeb3();
    // this.getPendingWithdrawal();

    await this.getAccountInfo();
    await this.getUserMaxProfit();

    this.getRecord();

    // // 购买金额
    // console.log( this.record.user.map(r=>this.web3.fromWei(r.BetValue.toNumber())) )
    // // 赔付金额
    // console.log( this.record.user.map(r=>this.web3.fromWei(r.ProfitValue.toNumber())) )
    // // 订单ID
    // console.log( this.record.user.map(r=>r.RandomQueryID.toNumber()) )
    // // 赏金(如果中?)
    // console.log( this.record.user.map(r=>this.web3.fromWei(r.RewardValue.toNumber())) )
    // // 购买的数字
    // console.log( this.record.user.map(r=>r.UserNumber.toNumber()) )
    // // 开奖的数字
    // console.log( this.record.user.map(r=>r.DiceResult.toNumber()) )
    // console.log( this.record.user.map(r=>r.SerialNumberOfResult.toNumber()) )
    
    // this.account = await this.getAccountInfo();
    // this.account.pendingWithdrawal = await this.getPendingWithdrawal();
    // this.record  = await this.getRecord();
  }
}
</script>

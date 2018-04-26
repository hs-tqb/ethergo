<style lang="less">
  @import url(~assets/css/variables.less);
  #page-home {
    // 赌注
    #panel-bet {
      .flow; justify-content:space-around;
      .selection { 
        .flow(row); .flow(row); height:40px; line-height:40px; align-items:stretch;
        .preview { padding:0 10px; min-width:70px; font-size:26px; text-align:center; color:@color-primary; background-color:#fff; .radius; }
        .preview + * { flex:1; }
      }
      #wager {
        .selection { 
          .list { 
            flex:1; .flow(row); margin-left:20px;
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
      .flow; text-align:center;
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
      .tabs { padding:5px; text-align:right; .border(bottom); }
      .tabs .btn { margin-left:5px; }
      .table-wrapper { width:100%; min-width:100%; height:calc(100%-46px); .scroll; }
      table { min-width:100%; border-collapse:collapse; }
      table td { padding:10px; white-space:nowrap; }
      table tr:nth-child(even) { background-color:rgba(0,0,0,0.3); }
      table tr:nth-child(odd) { background-color:rgba(0,0,0,0.5); }
      // table tbody td { text-align:center; }
      // table td span { .text-ellipsis; width:auto; max-width:20vw;  }
    }
  }

  @panel-height:calc( 100% - 92px );
  @media screen and (max-width:411px) {
    #page-home { 
      .panel#panel-bet { min-height:@panel-height; }
    }
  }
  @media screen and (min-width:412px) {
    #page-home { 
      .flow(row); height:@panel-height; overflow:hidden;
      .panel { flex:1; margin:0 10px; height:100; min-width:375px; .scroll; }
      #panel-bet { min-width:500px; }
      // #panel-bet, 
      // #panel-roll {  }
    }
  }
</style>

<template>
  <div id="page-home">
    <!-- 赌注 -->
    <div id="panel-bet" class="panel" v-if="roll.state==='ready'">
      <div id="amount">
        <h2>立刻投注</h2>
        <!-- <h3>立刻投注</h3> -->
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
        <p class="tips" v-if="typeof roll.result==='number'">
          <span v-if="roll.result===0" class="text-danger">- {{computedWager}} ETH</span>
          <span v-else-if="roll.result===1" class="text-success">+ {{computedUserProfit}} ETH</span>
          <span v-else-if="roll.result===2" class="text-warning">打款失败, 请手动提现</span>
          <span v-else-if="roll.result===3" class="text-warning">投注失败, 已退款</span>
          <span v-else-if="roll.result===4" class="text-warning">投注失败, 请手动提现</span>
        </p>
      </div>
      <div class="filler"></div>
      <input type="button" 
        class="btn primary block"
        v-if="typeof roll.result==='number'"
        @click="backToRoll"
        value="再玩一次" 
      >
      <span v-else style="height:50px;"></span>
    </div>

    <!-- 提现 -->
    <div id="panel-withdraw" class="panel" v-show="hash==='#withdraw'">
      <input type="button" class="btn primary" @click="doWithdraw" :value="`可提现金额: ${account.pendingWithdrawal}`">
    </div>
    <!-- 记录 -->
    <div id="panel-record" class="panel" v-show="hash==='#record' || !hash">
      <div class="tabs">
        <input type="button" class="btn" :class="record.show==='all'?'primary':''" @click="record.show='all'" value="all">
        <input type="button" class="btn" :class="record.show==='user'?'primary':''" @click="record.show='user'" value="user">
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <td>投注数字</td>
              <td>开奖数字</td>
              <td>投注金额</td>
              <td>玩家收益</td>
              <td>投注ID</td>
              <td>账户</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r,i) in record[record.show]" :key="`r-a-${i}`">
              <td>{{ r.UserNumber.toNumber() }}</td>
              <td>{{ r.DiceResult.toNumber() }}</td>
              <td>{{ web3.fromWei(r.BetValue.toNumber()) }}</td>
              <td>
                <span :class="`text-${r.computedProfit.state}`">
                  {{r.computedProfit.prefix}}
                  {{r.computedProfit.value}}
                </span>
              </td>
              <td>{{ r.BetID }}</td>
              <td><a :href="`https://etherscan.io/address/${r.UserAddress}`" target="_blank">
                {{ r.UserAddress }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 引导 -->
    <div id="panel-guide" class="panel" v-show="hash.indexOf('#guide')===0">
      <h2>怎么玩</h2>
      <ul class="anchors">
        <li><a href="#guide-game">游戏规则</a></li>
        <li><a href="#guide-metamask">使用 metamask</a></li>
        <li><a href="#guide-browser">使用 mist 浏览器</a></li>
        <li><a href="#guide-mobile">使用手机</a></li>
        <li><a href="#guide-tips">Hot Tips</a></li>
      </ul>
      <div id="guide-game">
        <h3>游戏规则</h3>
        <ul>
          <li>
            1. 你正在押注100面骰子滚动的结果。骰子掷出的结果是1-100。选择一个1-100的数字作为你的投注值
            <br>如果骰子结果低于你的号码，你就可以获得对应赔率的ETH！
          </li>
          <li>
            2. 首先设置您的赌注大小（ETH为单位）。
            <br>然后，调整“胜率大小”滑块来改变您获胜的比例。
            <br>要获胜，骰子的结果必须低于你的号码。
            <br>点击'投注'，即可开始游戏
          </li>
          <li>
            3. 如果掷骰子的结果低于您的“掷骰子”号码，您立即获胜并获得相应赔率奖励！
            <br>如果输了，智能合约会返给你1Wei（0.0000000000000001ETH）。
          </li>
          <li>注意：如果获胜，则从退回给玩家的总金额中扣除1％的佣金。您将承担小额gas费用进行下注。 我们不会收到gas费用。所有费用用于维护以太坊区块链。</li>
        </ul>
      </div>
      <!-- <div id="guide-metamask">
        <h3>使用 metamask</h3>
        <ol>
          <li>1111111111111111111</li>
          <li>2222222222222</li>
          <li>333333333333333333333</li>
          <li>444444444444444444444</li>
          <li>555555555555555555</li>
        </ol>
      </div>
      <div id="guide-browser">
        <h3>使用 mist 浏览器</h3>
        <p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        <ol>
          <li>1111111111111111111</li>
          <li>2222222222222</li>
          <li>333333333333333333333</li>
          <li>444444444444444444444</li>
          <li>555555555555555555</li>
        </ol>
      </div> -->
    </div>
    <div id="panel-help" class="panel" v-show="hash==='#help'">
      <h2>帮助</h2>
    </div>
  </div>
</template>

<script>
import contract from '~/assets/js/contract'
import Web3 from 'web3'
export default {
  data() {
    return {
      hash:'',
      web3:undefined,
      // 账户
      // account :{
      //   address:'',
      //   wei:0,
      //   balance:0,
      //   pendingWithdrawal:0,
      // },
      // 合约
      contract:{
        ...contract,
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
      mountedRun: false,
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
    },
    account() {
      // console.log( this.$store.state.account )
      return this.$store.state.account
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

      this.$store.commit('setAccount', { ...this.account, address, wei, balance })
    },
    // 获取合约
    getContract() {
      return this.contract.instance? 
        this.contract.instance:
        ( this.contract.instance=this.web3.eth.contract(this.contract.abi).at(this.contract.address) );
    },
    // 获取投注记录
    async getRecord() {
      if ( !this.checkAccountValid() ) return;
      // 获取当前的区块数
      let blockNumber   = await new Promise((resolve, reject)=>{
        this.web3.eth.getBlockNumber((err, result)=>{
          if (err) reject();
          resolve(result);
        });
      })
      .catch(this.commonErrorCatcher);

      // console.log('______________________blockNumber', blockNumber)
      
      // 估计n天的区块数, (假设一分钟上链10个)
      let dayBlockNumber = (60*24*10) * 1;

      // 获取合约
      let contract = this.getContract();


      /*

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
              console.log('___________________LogBet', result);
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
              console.log('___________________LogResult', result)
              results.push( result );
              resolve(result)
            });
          }).catch(this.commonErrorCatcher)
        ])

        // 如果两个数据长度不对等, 那就是有某条交易没有结果
        // 没有结果有两种状态, 等待手工退款(也显示为等待开奖), 已手工退款
        let LogRefund, refunds = [];
        if ( bets.length !== results.length ) {
          await new Promise((resolve,reject)=>{
            LogRefund = contract.LogRefund(
              { _userAddress: '' }, 
              { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
            )
            LogRefund.watch((err,result)=>{
              if (err) reject(err);
              refunds.push( result );
              resolve(result)
            })
          }).catch(this.commonErrorCatcher)
        }
      */

      let LogBet,ResultBet,LogRefund,
          bets=[], results=[], refunds=[];


      LogBet = contract.LogBet(
        { _userAddress: '' }, 
        { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
      );
      ResultBet = contract.LogResult(
        { _userAddress: '' }, 
        { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
      );
      LogRefund = contract.LogRefund(
        { _userAddress: '' }, 
        { fromBlock   : blockNumber>dayBlockNumber? blockNumber-dayBlockNumber: blockNumber }
      );
      
      LogBet.watch((err,result)=>{
        if ( err ) return;
        if ( bets.some(r=>r.args.BetID===result.args.BetID) ) return;
        bets.push( result );
        this.disposeRecord(bets, results, refunds);
      })
      ResultBet.watch((err,result)=>{
        if ( err ) return;
        if ( results.some(r=>r.args.BetID===result.args.BetID) ) return;
        results.push( result );
        this.disposeRecord(bets, results, refunds);
      });
      LogRefund.watch((err,result)=>{
        if (err) return;
        if ( refunds.some(r=>r.args.BetID===result.args.BetID) ) return;
        refunds.push( result );
        this.disposeRecord(bets, results, refunds);
      })
      

    },
    // 获取待提现金额
    async getPendingWithdrawal() {
      this.account.pendingWithdrawal = await new Promise((resolve,reject)=>{this
        .getContract()
        .userGetPendingTxByAddress(this.account.address, (err,result)=>{
          if ( err ) reject(err)
          console.warn(`未提现: ${ result.toNumber() }`)
          resolve(this.web3.fromWei(result.toNumber()))
        })
      })
      .catch(this.commonErrorCatcher);
    },
    disposeRecord(bets,results,refunds) {
      clearTimeout(this.disposeRecordTimer);
      
      this.disposeRecordTimer = setTimeout(()=>{
        if ( this.record.all.length && this.record.all.length!==bets.length ) {
          this.runHorse();
        }
        this.record.all = bets.map(b=>{
          let r  = results.filter(r=>r.args.BetID===b.args.BetID)[0] || {args:{}};
          let f  = refunds.filter(r=>r.args.BetID===b.args.BetID)[0] || {args:{}};
          let o  = { ...b.args, ...r.args, ...f.args};
          o.computedProfit = this.computeProfit( o );
          return o;
        }).reverse();
        this.record.user = this.record.all.filter(r=>r.UserAddress===this.account.address)
        this.recordDisposed = true;
      }, 300);
    },
    runHorse() {
      console.log('跑马');
    },
    // 提现
    doWithdraw() {
      if ( this.account.pendingWithdrawal == 0 ) 
        return this.commonErrorCatcher('没有可提现的金额');

      let contract = this.getContract();

      let additionParam = {
        // address:this.account.address,
        from:this.account.address,
        // _from:this.account.address,
        gas: 3000000,
        gasPrice: 200000000000
      };
      // 支付参数

      contract.userWithdrawPendingTransactions(
        // this.account.address, 
        // this.web3.toWei(this.account.pendingWithdrawal), 
        additionParam,
        (err, result)=>{
        if ( err ) return this.commonErrorCatcher(err);
        this.$store.commit('showMessageDialog', {type:'success', html:'提现成功<br>请稍后进行查询'});
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

      showWarning && warning && this.commonErrorCatcher(warning);

      return !warning;
    },
    // 检查合约可用
    checkContractAvailable(showWarning=true) {
      let warning = '';
      if ( !this.getContract() ) {
        warning = '合约获取失败';
      }

      showWarning && warning && this.commonErrorCatcher(warning);
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

      warning && this.commonErrorCatcher(warning);
      
      return !warning;
    },

    // --------- 其它 ---------
    // 通用的catcher
    commonErrorCatcher(err) {
      this.$store.commit('showMessageDialog',{type:'failure', text:err.toString()});
    },
    // 刷新页面数据
    async updatePageData() {
      this.getUserMaxProfit();
      await this.getAccountInfo();
      this.getRecord();
      this.getPendingWithdrawal();
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
          console.warn(`最大玩家收益: ${profit.max}`);
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
        if ( err ) return;
        // if ( err ) return this.commonErrorCatcher(err);
        let LogBet = contract.LogBet();
        // 
        this.roll.state = 'roll';
        // 投注支付监控
        LogBet.watch((err, result)=>{
          if ( err ) return this.commonErrorCatcher(err)
          if ( result.args.UserAddress !== this.account.address ) return console.log('其它的 bet');
          
          // console.log( result )
          console.warn('支付成功');
          // this.record.all.push({})
          // this.record.user.push(result.args)
          LogBet.stopWatching();
          // 刷新账户
          // this.getAccountInfo();
          // this.account.wei     -= (additionParam.gas*additionParam.gasPrice)+(+this.web3.toWei(this.computedWager))
          // this.account.balance = this.web3.fromWei( this.account.wei )
          this.updatePageData();
        })
        // 投注结果监控
        let LogResult = contract.LogResult();
        LogResult.watch((err, result)=>{
          if ( err ) return this.commonErrorCatcher(err);
          if ( result.args.UserAddress !== this.account.address ) return console.log('其它的 result');
          
          LogResult.stopWatching();
          // this.roll.result = result.args.DiceResult.toNumber()
          // console.log('______________jieguo');
          // console.log( result )
          // console.log('______________jieguo');
          this.roll.result = result.args.Status.toNumber()
          this.roll.value  = result.args.DiceResult.toNumber()

          // this.getAccountInfo();
          this.updatePageData();
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
      // 如果还没出结果
      if ( !r.DiceResult ) {
        r.DiceResult = { toNumber(){ return '-'; } }
        return { state:'pending', value:!!r.RefundValue?'已手工退款':'等待开奖' };
      }
      let compare = r.DiceResult.toNumber()<r.UserNumber.toNumber();
      let value   = this.web3.fromWei(compare? r.ProfitValue.toNumber(): r.BetValue.toNumber());

      return { state:compare?'success':'failure', value, prefix:compare?'+':'-' }
    },

    // --------- bet ----------
    // --------- bet ----------

    hashChange() {
      this.hash = location.hash;
    }
  },
  // 初始化 环境 和 账户信息
  async mounted() {
    if ( this.mountedRun ) return;
    this.mountedRun = true;
    this.initWeb3();
    this.updatePageData()

    window.addEventListener('hashchange', this.hashChange);
    this.hashChange();
  }
}
</script>

// abi
import abi from './abi'
// 档位
let gears = [
  { amount:0.1, profit:0.12,  num:76 },
  { amount:0.2, profit:0.36,  num:51 },
  { amount:1,   profit:3, num:31 },
  { amount:0.5, profit:3, num:16 },
]
// 二维码
import c1 from '~/assets/img/qrcode/c1.png'
import c2 from '~/assets/img/qrcode/c2.png'
import c3 from '~/assets/img/qrcode/c3.png'
import c4 from '~/assets/img/qrcode/c4.png'
let qrcodes = [c1,c2,c3,c4]
// 合约地址
let hub   = process.env.NODE_ENV==='development'?
    '0x503b00fe09aa2f4382f780b323d1697eb70b7dc3':
    '0xa6aef41be341fb364a432fb04a5d2bdd57546c76';

let addrs = process.env.NODE_ENV==='development'?
    [
      '0x0aa7895561011fb6de687548d749a01ac3ca7037',
      '0x4efd9d2d87bd9c39fbd501d9197fccfc02d354db',
      '0x14959c17d05f271d3efdb09bd68c804e7fd5411e',
      '0xe32861b906c06f509135305fba55a5ffc8e03c70',
    ]:
    [
      '0x2f846758e479ee7e0bd87cea5b9f8f3e314c6bd9',
      '0x209a1b17e577fab23e1c73c883a9732701b9ad3a',
      '0xd754ee6a9e8964602f48e11971e79d0b2f6452d5',
      '0xa6c76471cc89cff4e65cc1fc36613f3c31e4d0d1',
    ]

let contracts = {
  addrs, gears, qrcodes, abi, hub
}

// export default Array.from({length:4}, function(item,i) {
//   return { address:addrs[i], abi:abis[i], gear:gears[i] }
// })

export default contracts

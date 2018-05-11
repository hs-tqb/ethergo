import abi from './abi'
export default {
  address:process.env.NODE_ENV==='development'? 
    // '0xa0201395f7cde5b9dc39857b949ae8c2004eaf61':
    // '0xba34f675c6e440333754e11ef8c1c953d9fa8f20':  // 记录测试
    '0xb0a0968b6cff27d4b0abb576f473076b49b3f4b6': // 新版
    // '0x29f81c70b35c5cc84ac6deaf22c7221eec56fde6': // 可提现金额测试
    '0x4DF6DE08D11f11EBAd5d9E136B768849426fB8a7',

    abi: abi
}

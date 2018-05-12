import abi from './abi'
export default {
  address:process.env.NODE_ENV==='development'? 
    // 测试
    '0xb0a0968b6cff27d4b0abb576f473076b49b3f4b6': // 新版

    // 正式版
    '0x2D05359A51ca13C4ac5f4437585AFaf5bF2050F9',
    // '0xb0a0968b6cff27d4b0abb576f473076b49b3f4b6',

    abi: abi
}

const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const MsgVersion = 1;

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  env: process.env.ENV,

  scilla_version: "0",
  blockInterval: 10000, // 10000 : 10 seconds for one block
  blockStart: 0,
  gasPrice: 1, // ratio of gas to zil (dummy value of 1:1)
  nonce: 1, 
  
  prod: {
    contracts: {
      distributor: {
        address: ""
      },
    },
    
    endpoint: '',
    _version: bytes.pack(1, MsgVersion),
    myGasPrice: units.toQa('3000', units.Units.Li),
    gasLimit: Long.fromNumber(10000),
        
    walletPrivateKey: process.env.PK
  },
  
  dev: {
    contracts: {
      distributor: {
        address: "0x75d2a734489e594111dd7256e0d9cef52a4eefc7"
      },
    },
    
    endpoint: 'https://dev-api.zilliqa.com',
    _version: bytes.pack(333, MsgVersion),
    myGasPrice: units.toQa('3000', units.Units.Li),
    gasLimit: Long.fromNumber(10000),

    walletPrivateKey: process.env.PK,
  },
  sim: {
    contracts: {
      distributor: {
        address: ""
      },
    },
    
    endpoint: 'https://zilliqa-isolated-server.zilliqa.com/',
    _version: bytes.pack(222, MsgVersion), 
    myGasPrice: units.toQa('3000', units.Units.Li),
    gasLimit: Long.fromNumber(10000),

    walletPrivateKey: process.env.PK,
  },

  // tests
  tests: {
    account: {
      testPrivateKey: "",
      testAddress: ""
    }
  }
};
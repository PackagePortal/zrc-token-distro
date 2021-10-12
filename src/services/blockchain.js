const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  toBech32Address,
  getAddressFromPrivateKey
} = require('@zilliqa-js/crypto'); // https://github.com/Zilliqa/Zilliqa-JavaScript-Library/tree/dev/packages/zilliqa-js-crypto

const config = require('../../components/config');
const models = require('../../components/models');

var zilliqa = new Zilliqa(config[config.env].endpoint);
var initialized = false;

// internal init
async function init(privateKey = config[config.env].walletPrivateKey) {
  console.log("zil blockchain init environment " + config.env);

  let balance = null;

  try {
    zilliqa = new Zilliqa(config[config.env].endpoint);
    zilliqa.wallet.addByPrivateKey(privateKey);
    
    // nonce alignment
    balance = await zilliqa.blockchain.getBalance(getAddressFromPrivateKey(privateKey));
    config.nonce = balance.result.nonce;
    
    initialized = true;
  } catch (ex) {
    console.log(ex);
  }
}

async function getContractState(address) {
    return await zilliqa.contracts.at(address).getState();
}

async function callTransaction(tx, privateKey = config[config.env].walletPrivateKey) {
  try {
    if (initialized == false) await init(privateKey);
    
    if (await canPerformTransaction(getAddressFromPrivateKey(privateKey)) == false) 
      throw "TransactionFailureInsufficientGas";

    try {
      parameters = JSON.parse(tx.parameters);
    } catch (e) { }
    var msg = models.contract.transactionPayload(tx);
    
    config.nonce = config.nonce + 1;
    console.log({ nonce: config.nonce, operation: tx.operation, contract: config[config.env].contracts[tx.tag].address, parameters: JSON.stringify(tx.parameters)});

    // sharding reference
    // https://blog.zilliqa.com/provisioning-sharding-for-smart-contracts-a-design-for-zilliqa-cd8d012ee735
    const calledTx = await zilliqa.blockchain.createTransaction(
      zilliqa.transactions.new(
      {
        version: config[config.env]._version,
        nonce: config.nonce,
        toAddr: toBech32Address(config[config.env].contracts[tx.tag].address),
        amount: new BN(units.toQa('1', units.Units.Zil)), 
        gasPrice: config[config.env].myGasPrice, 
        gasLimit: config[config.env].gasLimit,
        code: "",
        data: JSON.stringify(msg)
      }),
      33,
      300,
      false
    );

    var contract = zilliqa.contracts.at(config[config.env].contracts[tx.tag].address);

    return calledTx.receipt;
  } catch (ex) { 
    console.log(ex);
  }
}

/* UTILS */
async function canPerformTransaction(address) {
  const balance = await zilliqa.blockchain.getBalance(address);  
  if (balance == null || balance.result.balance == null) return false;
  
  if (units.fromQa(new BN(balance.result.balance), units.Units.Zil) < 8000) {
    console.log({ "WARNING" : "Balance is low." });
    
    if (units.fromQa(new BN(balance.result.balance), units.Units.Zil) < 1000) {
      //console.log({ "WARNING" : "Balance is depleted; exiting." });
      //process.exit();
    }
  }
  
  const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();
  return new BN(balance.result.balance).gte(new BN(minGasPrice.result));
}

module.exports.getContractState = getContractState;
module.exports.callTransaction = callTransaction;
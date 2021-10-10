const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { MerkleTransaction, MerkleTree, hash} = require('../distribution/merkle');
const blockchain = require('./blockchain');
const models = require('../../components/models');
const config = require('../../components/config');
const keccak256 = require('keccak256');

async function getCurrentEpoch() {
  // this example acquires the epoch directly from the contract's state
  return Object.keys((await blockchain.getContractState(config[config.env].contracts.distributor.address)).merkle_roots).length;
}

async function constructMerkleRoot(transactions, completion) {
  try {
    if (transactions.length == 0) return; // no transactions

    const epoch = await getCurrentEpoch();

    // construct merkle tree with the transactions as leaves
    const leaves = transactions.map(x => x.hash);
    const tree = new MerkleTree(leaves, keccak256, { sortLeaves: true, sort: true } ); // the distributor contract in this example sorts leaves, and uses keccak256
    const root = tree.getRoot().toString('hex');
    
    transactions = transactions.map((x) => { x.setTree(tree); return x; }); // align with tree (root, and proofs)
    transactions = transactions.map((x) => { x.epoch = String(epoch); return x; }); // override with current epoch; probably necessary if storing somewhere

    completion({ leaves: transactions, epoch: epoch, root: root });
  } catch (ex) {
    console.log(ex);
  }
}

module.exports.constructMerkleRoot = constructMerkleRoot;
module.exports.MerkleTransaction = MerkleTransaction;

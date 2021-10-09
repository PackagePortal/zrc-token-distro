const { MerkleTree } = require('merkletreejs')
const sha256 = require('keccak256');

const keccak256 = require('keccak256');
const web3 = require("web3");

const hash = (account, amount) => {
    amount =  web3.utils.leftPad(amount, 32, 0);
    const amount_hash = keccak256(amount).toString("hex");
    const bytes = account + amount_hash;
    return "0x" + keccak256(bytes).toString("hex");
};

class MerkleTransaction {
	constructor(address, amount) {
		this.address = address.toString().toLowerCase();
		this.amount = amount;
		this.hash = this.getHash();
		this.epoch = null;
		this.root = null;
		this.proof = null;
	}

	getHash() {
		return hash(this.address, this.amount); // align with merkle tree distributor smart contract
	}

	setTree(tree) {
		this.proof = tree.getHexProof(this.hash);
		this.root = tree.getRoot();
	}
}

module.exports.MerkleTransaction = MerkleTransaction;
module.exports.MerkleTree = MerkleTree;
module.exports.hash = hash;
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');
const web3 = require("web3");

// hash function for individual leaves; in this example we leverage keccak256 & use the account & amount concatted; see the scilla distributor contract `hash_leaves` for more
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
		return hash(this.address, this.amount);
	}

	// store root & proof, helps if storing these internally somewhere to help users claim in the future (to provide the respective proofs)
	setTree(tree) {
		console.log(this.hash);
		this.proof = tree.getHexProof(this.hash);
		this.root = tree.getRoot();
	}
}

module.exports.MerkleTransaction = MerkleTransaction;
module.exports.MerkleTree = MerkleTree;
module.exports.hash = hash;
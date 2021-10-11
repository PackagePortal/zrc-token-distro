const distributor = require('./src/services/distributor');
const blockchain = require('./src/services/blockchain');
const { MerkleTransaction } = require('./src/distribution/merkle');
const models = require('./components/models');

async function constructMerkleRoot(leaves, completion) {
    // construct merkle root with transactions for current epoch
  	await distributor.constructMerkleRoot(leaves, async (merkle) => {
  		// set merkle root on distributor contract
    	const tx = models.transactions.build("SetMerkleRoot", { epochNumber: merkle.epoch, merkleRoot: merkle.root }, tag = "distributor");
    	const result = await blockchain.callTransaction(tx);
    	console.log(result);

    	completion(merkle);
  	});
}

async function claim(transaction) {
  	// via contract
  	const claimTx = models.transactions.build("Claim", { epochNumber: transaction.epoch, address: transaction.address, amount: transaction.amount, 
		proof: transaction.proof }, tag = "distributor")
  	
  	const result = await blockchain.callTransaction(claimTx);
  	console.log(result);
};

async function ConstructMerkleRootAndClaimExample() {
	// transaction input for current epoch
	let sampleTransactions = [
    new MerkleTransaction("0x446c4DEeA95afAcC3E41D552d55dE376A2908AE0", 1),
		new MerkleTransaction("0x446c4DEeA95afAcC3E41D552d55dE376A2908AE0", 2), 
		new MerkleTransaction("0x89C0d175D9d9E3c9fa2F89Ca3752eB03f0C65D43", 1),
  	new MerkleTransaction("0x89C0d175D9d9E3c9fa2F89Ca3752eB03f0C65D43", 2),
 		new MerkleTransaction("0x628A50C412b9Da136bE7D8401e101Ca46b3863B4", 1),
    new MerkleTransaction("0x628A50C412b9Da136bE7D8401e101Ca46b3863B4", 2)
  ];

	await constructMerkleRoot(sampleTransactions, async (merkle) => {
		// example claim on the first transaction
		await claim(merkle.leaves[0]);
	});
}

ConstructMerkleRootAndClaimExample();
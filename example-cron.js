const cron = require('node-cron');
const distributor = require('./src/services/distributor');
const models = require('./components/models');
const blockchain = require('./src/services/blockchain');

cron.schedule('*/60 * * * *', async () => {
	const transactions = []; // acquire transactions somehow, e.g database or queue
	await distributor.constructMerkleRoot(transactions, async (merkle) => {
    	const tx = models.transactions.build("SetMerkleRoot", { epochNumber: merkle.epoch, merkleRoot: merkle.root });
    	//.. execute tx
    	const result = await blockchain.callTransaction(tx);
    	console.log(result);
	});
});
# ZRC Token Merkle Distribution #
Welcome! the aim of this repo is to provide a working, simple example for zrc token distributions, & work as a resource for anyone looking to build a backend system for this distribution model.

## What is a token distributor? ##
- token distributors are smart contracts that allow for both validating inclusion for a certain transaction that was stored previously, as well as fasciliating some sort of crediting for said inclusion. the most obvious example is crediting users for transactions they've propogated in the past, like liquidity adds or removals for LP rewards. these contracts leverage the merkle tree data structure for the claim verification.
- [distributor.scilla](https://github.com/PackagePortal/zrc-contracts/tree/main/contracts/distributor.scilla) | [specs](https://github.com/PackagePortal/zrc-contracts/tree/main/specs/Distributor.md)

## How does a merkle tree work? ##
- the Merkle Tree is a data structure mainly used for validating inclusion within a dataset quickly using hashes. (very similar to a binary hash tree) for a quick overview via the library we used, see: https://github.com/miguelmota/merkletreejs

## What's the overall flow? ##
- first, lets say you have some input of transactions that you want to "store", and some users that want to claim rewards for these transactions. periodically, you'd set a merkle root - essentially the head hash of a previously constructed merkle tree that contains transactions per a specific time period, or epoch. depending on how much you want to leave on the end-user for validating their inclusion to claim their reward, you may want to store these transactions with their respective proofs somewhere to ease the claiming process. then, when a user sends a claim request, your system can lookup the respective transactions proof internally, provide that for the user and help them claim the reward. while your system helps prove inclusion for the user, its a means of fascilitating a reward system reliant on the user manually claiming vs. crediting per transaction separately, which could become quite the gas guzzler. 
- example: for epoch 0 (the starting period), you'd construct a merkle tree for all the transactions that transpired over this epoch,
```
const leaves = [new MerkleTransaction("0x732514cfd4e5012D6F12652cdBA7B2fc0C72DfD9", 1),
						new MerkleTransaction("0x732514cfd4e5012D6F12652cdBA7B2fc0C72DfD9", 2)].map(x => x.hash);
const tree = new MerkleTree(leaves, keccak256, { sortLeaves: true, sort: true } ); // this example uses keccak256 for leaf hashes
const root = tree.getRoot().toString('hex');
```
set it's root on the distributor, 
```
transition SetMerkleRoot(epoch_number: Uint32, merkle_root: ByStr32)
```
and store the data for fascilitating user claims at some future date. once the merkle root is set, all of the transactions under that root become _claimable_. then after the next time period or epoch 1, you'd construct a new tree for the most recent transactions, set the root, rinse and repeat.
- for users to claim, they'd need to provide the epoch of the transaction, amount, and the merkle tree "proofs" to validate inclusion. again, these can be stored by your system to ease the claim process for the end-user, merely requiring them to propegate the claims transaction from their wallet.
```
type Claim =
| Claim of Uint32 DistributionLeaf (List ByStr32) (* epoch number, leaf, proof path as a list of hashes *)


transition Claim(claim: Claim)
```

additional resource: https://medium.com/builders-of-zilliqa/token-distributors-in-scilla-b37241f7466a

## Requirements ##
- node 12.12

## Instructions to run ##
- `git clone https://github.com/PackagePortal/zrc-token-distro.git`
- `cd zrc-token-distro`
- `npm install`

- configure `ENV` (dev|prod|sim) & `PK` (a zilliqa wallet with sufficient gas's private key) variables in a local .env
- add respective contract address into `config.js` per environment
- `node example-cron` (set merkle cron example)
- `node example` (set merkle root & claim example)

## Run tests ##
- `npm test`


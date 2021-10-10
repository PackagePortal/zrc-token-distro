## introduction ##

# what is a token distributor? #
- token distributors are smart contracts that allow for both validating inclusion for a certain transaction that was stored previously, as well as fasciliating the crediting for said inclusion. the most obvious example is crediting users for transactions they've propogated in the past. these
contracts leverage the merkle tree data structure for the claim verification.

# how does a merkle tree work? #
- tldr; it's a data structure for storing data and validating a dataset exists historically in the said data structure quickly using hashes. for a quick overview via the library we used, see: https://github.com/miguelmota/merkletreejs

# what's the overall flow? #
- first, lets say you have some input of transactions that you want to "store", and some users that want to claim rewards for these transactions. periodically, you'd set a merkle root, essentially the head hash of a previously constructed merkle tree of transactions per a specific time period, or epoch. depending on how much you want to leave on the end-user for validating their inclusion to claim their reward, you may want to store these transactions with their respective proofs to ease the claiming process. then, when a user sends a claim request, your system can lookup the respective transactions proof internally, provide that for the user and help them claim the reward. while your system helps prove inclusion for the user, its a means of fascilitating a reward system reliant on the user manually claiming vs. crediting per transaction separately, which could become quite the gas guzzler. 
- example: for epoch 0 (the starting period), you'd construct a merkle tree for all the transactions that transpired over this epoch, set it's root on the distributor, and store the data for fascilitating user claims at some future date. once the merkle root is set, all of the transactions under that root are _claimable_. then after the next time period or epoch 1, you'd construct a new tree for the most recent transactions, set the root, rinse and repeat.
- for users to claim, they'd need to provide the epoch of the transaction, amount, and the merkle tree "proofs" to validate inclusion. again, these can be stored by your system to ease the claim process for the end-user, merely requiring them to propegate the claims transaction from their wallet.


## example requirements ##
- node 12.12

## instructions  ##
- `git clone https://github.com/PackagePortal/zil-token-distro.git`
- `cd zil-token-distro`
- `npm install`

- `node example-cron` (set merkle cron example)
- `node example` (set merkle root & claim example)

## run tests ##
- `./node_modules/mocha/bin/mocha tests -s 0` (`tests/test.js`)


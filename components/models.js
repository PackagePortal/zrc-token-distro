const config = require('../components/config');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const {
  fromBech32Address,
  toBech32Address,
  getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto'); // https://github.com/Zilliqa/Zilliqa-JavaScript-Library/tree/dev/packages/zilliqa-js-crypto

module.exports = {
  address: {
    safelyConvertToByStr20(address) {
      var address;
      try {
        const bech32prefix = new RegExp('^zil');
        if (bech32prefix.test(address)) address = fromBech32Address(address); // ensure ByStr20 compatible
      } catch (e) { console.log(e); } 

      return address;
    }
  },
  transactions: {
	 build(operation, params, tag, metadata) {
		let operations = {	
      SetMerkleRoot: {
        params: [{
          vname: 'epoch_number',
          type: 'Uint32',
          value: `${params["epochNumber"]}`
        },
        {
          vname: 'merkle_root',
          type: 'ByStr32',
          value: `0x${params["merkleRoot"]}`
        }],
        success_code: "MerkleRootSet"
      },
      Claim: {
        params: [{
          vname: 'claim',
          type: `${config[config.env].contracts["distributor"].address}.Claim`,
          value: {
            constructor: `${config[config.env].contracts["distributor"].address}.Claim`,
            argtypes: [],
            arguments: [
              params["epochNumber"],
              {
                constructor: `${config[config.env].contracts["distributor"].address}.DistributionLeaf`,
                argtypes: [],
                arguments: [`${params["address"]}`, `${params["amount"]}`],
              },
              params["proof"], // array [tx_1, tx_2, tx_n]
            ],
          },
        }],
        success_code: "Claimed"
      },
    };
	
		return { operation: operation, 
					   parameters: operations[operation].params, 
             tag: tag,
					   success_code: operations[operation].success_code
           };
	 },
  },
  contract: {
    // zil payload reference: https://scilla.readthedocs.io/en/latest/interface.html
  	transactionPayload(tx) {
  		return {
		    "_tag"    : tx.operation,
		    "_amount" : "0",
        "_sender" : getAddressFromPrivateKey(config[config.env].walletPrivateKey),
		    //"_recipient": recipient,
		    "params"  : tx.parameters
		  };
  	}
  }
}

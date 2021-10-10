const liquidity = require('../src/services/distributor');
const { MerkleTransaction, MerkleTree, hash} = require('../src/distribution/merkle');
const keccak256 = require('keccak256');

const assert = require('assert');

describe('distribution', function() {
  describe('merkle tree impl', function() {
    it('should assert valid transaction inclusion', function() {

  let sampleScans = [new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f4c", 1),
                new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f6c", 2),  
                new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f5d", 3)];

      let leaves = sampleScans.map(x => x.getHash());
      
      const tree = new MerkleTree(leaves, keccak256) 
      const root = tree.getRoot()

      const leaf = new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f4c", 1)
      const proof = tree.getProof(leaf.getHash())
      assert.strictEqual(tree.verify(proof, leaf.getHash(), root), true)
    });

    it('should assert invalid transaction inclusion ', function() {
  let sampleScans = [new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f8z", 1),
                new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f6c", 1), 
                new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f5d", 1)];

      let leaves = sampleScans.map(x => x.getHash());
      
      const tree = new MerkleTree(leaves, keccak256) 
      const root = tree.getRoot()

      var leaf = new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f4c", 1) // invalid sender
      var proof = tree.getProof(leaf.getHash())
      assert.strictEqual(tree.verify(proof, leaf.getHash(), root), false)

      leaf = new MerkleTransaction("0xc2035715831ab100ec42e562ce341b834bed1f8z", 2) // invalid claim amt
      proof = tree.getProof(leaf.getHash())
      assert.strictEqual(tree.verify(proof, leaf.getHash(), root), false)
    });
  });
});

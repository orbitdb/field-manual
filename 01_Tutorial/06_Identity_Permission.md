## Chapter 6: Identity and Permissions

> TODO: Description

<div>
  <h3>Table of Contents</h3>
  
Please complete [Chapter 5 - Peer to Peer Part 2 (OrbitDB)](./05_P2P_Part_2.md) first.

- [On security](#on-security)
- [Distrbuted identity management](#distributed-identity-management)
- [On security](#)
- [On security](#)
- [Key takaways](#)

</div>

### On security

As we've stated before, security-minded people reading this tutorial, or even approaching the distributed industry as a whole, tend to think that this is a wild west full of cowboys who throw caution to the wind while they create systems with security holes you can run a stampede of cattle through.

They're right. OrbitDB and IPFS are still _alpha software_, there have been security flaws discovered, reported, and disclosed and there. Even so far in our app, the databases you have created in this tutorial are only write-protected via a static ACL.

This has the following implications:

1. Everybody will still be able to read the data given a CID or content hash via a simple `ipfs.dag.get` or `ipfs.get` call.
2. The ACL can never change, which means you can't add/revoke other write permissions, and if you lose access to your IPFS node, you can never write to it either.

Security is a vast topic. People can, and do, spend decades of their lives thinking about and working on securirty in all it's numerous aspects. For the purposes of this tutorial, we will approach security from three perspectives: Encryption, Identity, and Authorization.

### Encryping and decrypting your data

The first thing you'll do to mitigate implication #1 above is to encrypt the data locally, and store it in OrbitDB (and therefore IPFS) in its encrypted form.

OrbitDB is agnostic in terms of encryption to ensure maximum flexibility with your application layer. However, you can learn a simple method of reading and writing encrypted data to the stores, by creating a simple (and useless in terms of real security) pair of functions.

```diff
encrypt(data) {
}

decrypt(data) {
}
```

Then, for example, you could update the `getProfileFields` and `updateProfile` functions:

```diff
```

#### What just happened?

You learned a simple but effective method of encrypting and decrypting data for transferring data in and out of OrbitDB.

- `this.encrypt` will encrypt the data locally in memory before storage
- `this.decrypt` will take encrypted data from storage, and decrypt it locally, in memory

You have many options to choose from in terms of, and while we are reticent to make an "official" recommendation, here's a few places you can start to look:

- [Node.js crypto module](https://nodejs.org/api/crypto.html)
- [Web Crypto Libraries](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### Distributed identity management

Encrypting data will work great given a strong enough encryption method. If you picked correctly, you now have until the heat death of the universe until somebdoy guesses your encryption keys and brute forces your data open. The problem, then, becomes **key management**, which is tied to identity.

Distributed identity is still a hotly contested topic, and frankly an unsolved problem, in our industry. However, many organizations have recently lept ahead with solutions and there will be more to come. [Metamask] and its ties to the ethereum blockchain, are one.

#### What just happeened?

### Further Authorization

#### What just happeened?

### Key takeaways

* Resolves: #[397](https://github.com/orbitdb/orbit-db/issues/397)
* Resolves: #[222](https://github.com/orbitdb/orbit-db/issues/222)
* Resolves: #[327](https://github.com/orbitdb/orbit-db/issues/327)
* Resolves: #[357](https://github.com/orbitdb/orbit-db/issues/357)
* Resolves: #[475](https://github.com/orbitdb/orbit-db/issues/475)
* Resolves: #[380](https://github.com/orbitdb/orbit-db/issues/380)
* Resolves: #[458](https://github.com/orbitdb/orbit-db/issues/458)
* Resolves: #[467](https://github.com/orbitdb/orbit-db/issues/467)

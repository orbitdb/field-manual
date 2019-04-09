## Chapter 6: Identity and Permissions

> TODO: Description

<div>
  <h3>Table of Contents</h3>
  
Please complete [Chapter 5 - Peer to Peer Part 2 (OrbitDB)](./05_P2P_Part_2.md) first.

- [On security](#on-security)
- [Encryping and decrypting your data](#encrypting-and-decrypting-your-data)
- [Distrbuted identity management](#distributed-identity-management)

</div>

### On security

As we've stated before, security-minded people reading this tutorial, or even approaching the distributed industry as a whole, tend to think that this is a wild west full of cowboys who throw caution to the wind while they create systems with security holes you can run a stampede of cattle through.

They're right. OrbitDB and IPFS are _alpha software in an alpha industry_, there have been security flaws discovered, reported, and disclosed there. Even so far in our app, the databases you have created in this tutorial are only write-protected via a static ACL.

This has the following implications:

1. Everybody will still be able to read the data given a CID or content hash via a simple `ipfs.dag.get` or `ipfs.get` call.
2. The ACL can never change, which means you can't add/revoke other write permissions, and if you lose access to your IPFS node, you can never write to it either.

Security is a vast topic. People can, and do, spend decades of their lives thinking about and working on security in all its numerous aspects. For the purposes of this tutorial, we will approach security from three perspectives: Encryption, Identity, and Authorization.

### Encrypting and decrypting your data

The first thing you'll do to mitigate implication #1 above is to encrypt the data locally, and store it in OrbitDB (and therefore IPFS) in its encrypted form. Your users might want to create some private profile fields, so you'll enable this functionality.

OrbitDB is agnostic in terms of encryption to ensure maximum flexibility with your application layer. However, you can learn a simple method of reading and writing encrypted data to the stores, by creating a simple (and useless in terms of real security) pair of functions.

```diff
+ encrypt(data) {
+   const stringified = JSON.stringify(data)
+   const reversed = stringified.split("").reverse().join("")
+   return
+ }

+ decrypt(data) {
+   const unreversed = data.split("").reverse().join("")
+   const jsonEncoded = JSON.parse(jsonEncoded)
+   return jsonEncoded
+ }
```

Then, for example, you could update the `getProfileFields` and `updateProfile` functions:

```diff
- getProfileField(key) {
+ getProfileField(key, encrypted=false) {
-    return this.user.get(key)
+    let data
+
+    if(encrypted) {
+      key = this.decrypt(key)
+      data = this.decrypt(data)
+    } else {
+      data = this.user.get(key)
+    }
+
+    return data
+ }

- async updateProfileField(key, value) {
- async updateProfileField(key, value, encrypted=true) {
+   if(encrypted) {
+     key = this.encrypt(key)
+     value = this.encrypt(value)
+   }
    const cid = await this.user.set(key, value)
    return cid
}
```

Of course, this is a toy example and only reverses strings, but you can see how encryption can be used to protect your data and "hide it in plain sight," so to speak.

#### What just happened?

You learned a simple but effective method of encrypting and decrypting data for transferring data in and out of OrbitDB.

- `this.encrypt` will encrypt the data locally in memory before storage
- `this.decrypt` will take encrypted data from storage, and decrypt it locally, in memory

You have many options to choose from in terms of, and while we are reticent to make an "official" recommendation, here's a few places you can start to look:

- [Node.js crypto module](https://nodejs.org/api/crypto.html)
- [Web Crypto Libraries](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

Encrypting data will work great given a strong enough encryption method. If you picked correctly, you could wait at the restaurant at the end of the universe until somebody guesses your encryption keys and brute forces your data open. The problem, then, becomes **key management**.

### Smart Contract Authentication

Distributed identity is still a hotly contested topic, and frankly an unsolved problem, in our industry. However, many organizations have recently leapt ahead with solutions and there will be more to come. [Metamask] and its ties to the ethereum blockchain, are one.

#### What just happened?

### Creating your own authentication middleware

#### What just happened?

### Key takeaways

- Resolves: #[397](https://github.com/orbitdb/orbit-db/issues/397)
- Resolves: #[222](https://github.com/orbitdb/orbit-db/issues/222)
- Resolves: #[327](https://github.com/orbitdb/orbit-db/issues/327)
- Resolves: #[357](https://github.com/orbitdb/orbit-db/issues/357)
- Resolves: #[475](https://github.com/orbitdb/orbit-db/issues/475)
- Resolves: #[380](https://github.com/orbitdb/orbit-db/issues/380)
- Resolves: #[458](https://github.com/orbitdb/orbit-db/issues/458)
- Resolves: #[467](https://github.com/orbitdb/orbit-db/issues/467)

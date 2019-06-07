## Chapter 6: Identity and Permissions

> OrbitDB is extremely flexible and extensible, allowing for security via strong _encryption_, and _custom access control_ based on your application's specific code and requirements

<div>
  <h3>Table of Contents</h3>

Please complete [Chapter 5 - Peer to Peer Part 2 (OrbitDB)](./05_P2P_Part_2.md) first.

- [On security](#on-security)
- [Encryping and decrypting your data](#encrypting-and-decrypting-your-data)
- [Creating a custom access controller](#creating-a-custom-access-controller)
</div>

### On security

As we've stated before, security-minded people reading this tutorial, or even approaching the distributed industry as a whole, tend to think that this is a wild west full of cowboys who throw caution to the wind while they create systems with security holes you can run a stampede of cattle through.

They're right. OrbitDB and IPFS are _alpha software in an alpha industry_, there have been security flaws discovered, reported, and disclosed there. Even so far in our app, the databases you have created in this tutorial are only write-protected via a static ACL.

This has the following implications:

1. Everybody will still be able to read the data given a CID or content hash via a simple `ipfs.dag.get` or `ipfs.get` call.
2. The ACL can never change, which means you can't add/revoke other write permissions, and if you lose access to your IPFS node, you can never write to it either.

Security is a vast topic. People can, and do, spend decades of their lives thinking about and working on security in all its numerous aspects. For the purposes of this tutorial, we will approach security from two perspectives: Encryption and Access control

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

Encrypting data will work great given a strong enough encryption method. If you picked correctly, you could wait at the restaurant at the end of the universe until somebody guesses your encryption keys and brute forces your data open. The problem, then, becomes _key management_.

### Creating your own authentication middleware

Write access to databases is managed using OrbitDB's access controllers. Access controllers are flexible and extensible; you can either use the default, OrbitDBAccessController, or you can create your own. This means that you can use a third-party application to verify access, such as "Log in with Metamask", or use custom application code to control access.

If no access controller is specified, OrbitDB will use the default OrbitDBAccessController to grant write access. OrbitDBAccessController allows you to list which peers have access. If no peers are specified, only the creator of the database will be granted write access. The peer's identity.id property is used to grant write access to a database when using OrbitDBAccessController.

Alternatively, you can define your own rules to manage write access. You will now implement an access controller using a simple example that can be built upon in the future.

Add a simple function to the `NewPiecePlease` class:

```
+ authenticated() { return true }
```

It's not much to look at, but remember that you can put whatever code you want there to return true or false: You can check a cookie, contact an API, or verify identity against a third party service like Keybase or Twitter. You just want this function to return a boolean.

Then, create a brand new JavaScript class called "NPPAccessController"

```
+ class NPPAccessController extends AccessController {
+   async canAppend (entry, identityProvider) {
+     const authenticated = NPP.authenticated()
+     return Promise.resolve(authenticated)
+   }
+
+   async grant () { }
+ }
```

Finally, add this to your options object to include this access controller, and pass in the options when creating databases.

```
+ const customAccessOptions = {
+   ..defaultOptions
+    accessControllerr: NPPAccessController
+ }
+ const counterDb = await this.orbitdb.counter(dbName, customAccessOptions)
```

Your access controller will then utilize the `NPP.authenticated` function to verify. Right now this will always return `true`, but you are free to modify that function as you see fit based on your custom needs.

#### What just happened?

You created a simple access controller, using code from within the `NewPiecePlease` class to verify.

- `authenticated` is your playground - check cookies, ask your servers, do whatever you need to do
- `AccessController` is the class you want to extend to create your custom access controllers
- `canAppend` is a permission function that returns a resolved promise based on your custom code - a rejected promise means a rejected database append
- `grant`, if implemented, would allow you to grant access to new users of the system over time

### Key takeaways

- Security is hard and it is on you, the developer, to keep it in mind as you develop your applications
- OrbitDB is unopinionated in terms of security topics, which provides maximal flexibility
- Strong encryption is an effective way to ensure your data remains private inside a peer-to-peer swarm
- OrbitDB Access Control is fully plugabble and customizable

**Note:** Please complete Chapter 1 before reading. 

# Chapter 2 - Managing Data

## Adding data to our database

Now that you have a database set up, adding content to it is fairly easy:

```javascript
const result = await piecesDb.put({
  _id: Date.now(),
  url: formData.get("url"),
  instrument: formData.get("instrument")
})
                                                
const resultContent = await node.dag.get(result)
```

Running this code should give you something like the following output. Hold steady, it's overwhelming but it will make sense 
after we explain what happened.

```json
{"value":{"v":1,"id":"/orbitdb/zdpuAwJazDkbsZuSPHEfhkbHkAh7YFFVgd6j2jpHjs86TeaCm/pieces","cid":null,"key":"04b322b0970e03a45cd8418792cc0cdb0595408e8463aae5f1e45254befb084c642cfea088342dfa38eff40d26f20659e7ab62f21c0400c0e0450ac7663027122c","sig":"3044022076a5f0db573711702bac4c72d09d23ff75c982142182a28fb048da5751f3759802203aedacfae5a6910df0e90486445bf34a9c91feb32d06e6c864200d131edae430","next":[{"codec":"dag-cbor","version":1,"hash":{"type":"Buffer","data":[18,32,238,3,211,117,49,227,203,20,136,108,10,254,103,178,200,167,150,56,57,5,13,29,185,249,209,105,134,228,14,118,32,131]}}],"clock":{"id":"04b322b0970e03a45cd8418792cc0cdb0595408e8463aae5f1e45254befb084c642cfea088342dfa38eff40d26f20659e7ab62f21c0400c0e0450ac7663027122c","time":2},"payload":{"op":"PUT","key":1551133663072,"value":{"_id":1551133663072,"url":"12345","instrument":"Accordion"}},"identity":{"id":"04468e3d39cb02fb67c111a3dc0795ad5efe3f2af9c3d292ed5fe17cad073a2e8e81fd766e7e2ba0e348c697cd9245ecd261c2e837e37dadceba139185a8e9a248","type":"orbitdb","publicKey":"04b322b0970e03a45cd8418792cc0cdb0595408e8463aae5f1e45254befb084c642cfea088342dfa38eff40d26f20659e7ab62f21c0400c0e0450ac7663027122c","signatures":{"id":"3044022027881709d8440f42ecdbc6ba4925dc6dfad609a75e39a46e6a58e88d8344c1e902203f369c5c0ceb6bfcf4e9a8d2d6c8a597f3244a19b25ee0cde44fce97aad4b5e4","publicKey":"3045022016d569e4c89dd0b76bf1f27df462b2c0559d20c952f88892d4d758e30e2a6f4a022100d624ebeb3028648e967f2844acf979830d6a02ea2e885fa71a66d040ee943131"}}},"remainderPath":"","cid":{"codec":"dag-cbor","version":1,"hash":{"type":"Buffer","data":[18,32,62,76,23,6,158,134,155,240,243,37,5,20,34,106,59,8,207,162,12,84,243,82,150,100,138,221,105,197,39,86,24,154]}}}
```

## Reading data

## On Loading

## Storing Media Files

> Potentially split out to chapter 2?

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)

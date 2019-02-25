**Note:** Please complete Chapter 1 before reading. 

# Chapter 2 - Managing Data

> Managing data in OrbitDB involves _x_, _y_, and _z_.

## Adding data to our database

Now that you have a database set up, adding content to it is fairly easy. Run the following code to add some sheet music to the repository.

```javascript
const result = await piecesDb.put({
  _id: Date.now(),
  url: ,
  instrument: formData.get("instrument")
})
                                                
const resultContent = await node.dag.get(result)
```

Running this code should give you something like the following output. Hold steady, it's overwhelming but it will make sense 
after we explain what happened.

For more information see Part 3.

```json
{
  "op":"PUT",
  "key":1551137682387,
  "value":  {
    "_id":1551137682387,
    "url":"12345",
    "instrument":"Accordion"
  }
}
```

## Storing Media Files

## Reading data

## On Loading

* Resolves #[365](https://github.com/orbitdb/orbit-db/issues/365) 
* Resolves #[438](https://github.com/orbitdb/orbit-db/issues/438)
* Resolves #[381](https://github.com/orbitdb/orbit-db/issues/381)
* Resolves #[242](https://github.com/orbitdb/orbit-db/issues/242)
* Resolves #[430](https://github.com/orbitdb/orbit-db/issues/430)

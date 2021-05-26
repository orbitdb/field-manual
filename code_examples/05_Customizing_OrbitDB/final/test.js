const IPFS = require("ipfs")
const OrbitDB = require("orbit-db")
const NotesIndex = require("./NotesIndex")
const NotesStore = require("./NotesStore")

async function run() {
  let ipfs = await IPFS.create()
  OrbitDB.addDatabaseType(NotesStore.type, NotesStore)
  let orbitdb = await OrbitDB.createInstance(ipfs)

  let store = await orbitdb.create(Math.random().toString(), NotesStore.type)
  console.log("Address: " + store.address.toString())
}

run()

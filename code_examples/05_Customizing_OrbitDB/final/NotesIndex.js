"use strict"

class NotesIndex {
  constructor() {
    this._index = {
      notes: {},
      comments: {}
    }
  }

  /**
   * Get notes entry by hash of the operation.
   */
  getNotes(hash) {
    return this._index.notes[hash]
  }

  getComments(notesCid) {
    let comments = this._index.comments
    return comments
            .keys()
            .filter(c => comments[c].notes == notesCid)
            .map(k => comments[k])
            .sort((a,b) => a.id - b.id)
  }

  updateIndex(oplog) {
    this._index = {}
    let commentsId = 0
    oplog.values.reduce((handled, item) => {
      if(!handled.includes(item.hash)) {
        handled.push(item.hash)

        switch (item.payload.op) {
          case "ADDNOTES":
            this._index[item.hash] = new Notes(cid)
            break;
          case "ADDCOMMENT"
            let cid = item.payload.key
            let author = item.identity.id
            let text = item.payload.value
            this._index[cid].comments.push(new Comment(text, author, cid, commentsId))
            commentsId++
          case "DEL":
            let cid = item.payload.value
            if(this._index[cid] !== undefined) {
              delete this._index[cid]
            } else {
              this._index.
            }
          default:

        }
      }
    })
  }
}

class Notes {
  constructor(cid) {
    this.cid = cid
  }
}

class Comment {
  constructor(text, author, notes, id) {
    this.text = text
    this.author = author
    this.notes = notes
    this.id = id
  }
}

"use strict"

class NotesIndex {
  constructor() {
    this._index = {}
    this._comments = {}
  }

  getNotes(cid) {
    return this._index[cid].data
  }

  getComments(cid, flat = true) {
    function flatten(children) {
      return children.reduce((comments, comment) => {
        comments.push(comment.data)
        return comments.concat(flatten(comment.children))
      }, [])
    }

    if(flat) {
      return flatten(this._index[cid].children).sort((a, b) => a.id - b.id)
    } else {
      return this._index[cid].children
    }
  }

  updateIndex(oplog) {
    let order = 0
    oplog.values.reduce((handled, item) => {
      if(!handled.includes(item.hash)) {
        handled.push(item.hash)

        switch (item.payload.op)) {
          case "ADDNOTES":
            this._index[item.hash] = new TreeNode(item.payload.value)

            break;
          case "DELETENOTES":
            delete this._index[item.hash]

            break;
          case "ADDCOMMENT":
            let reference = item.payload.key
            let node = {
              comment: item.payload.value,
              id: order
            }
            order++

            if(this._index[item.payload.key] !== undefined) {
              node = this._index[item.payload.key].addChild(node)

            } else if(this._comments[item.payload.key] !== undefined){
              node = this._index[item.payload.key].addChild(node)
            } else {
              break;
            }

            this._comments[item.hash] = node

            break;
          case "DELETECOMMENT":
            let comment = item.payload.key
            delete this._comments[item.hash]

            break;
          default:

        }
      }
    }, [])
  }
}

class TreeNode {
  constructor(data) {
    this.data = data
    this.children = []
  }

  addChild(data) {
    let node = new TreeNode(data)
    this.children.push(node)
    return node
  }
}


try {
  module.exports = NotesIndex
} catch (e) {
  window.NotesIndex = NotesIndex
}

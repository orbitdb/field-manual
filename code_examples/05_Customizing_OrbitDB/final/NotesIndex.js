"use strict"

class NotesIndex {
  constructor() {
    this._index = {}
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
    oplog.values.reduce((handled, item) => {
      if(!handled.includes(item.hash)) {
        handled.push(item.hash)

        switch (item.payload.op)) {
          case "ADDNOTES":

            break;
          case "DELETENOTES":

            break;
          case "ADDCOMMENT":

            break;
          case "ADDCOMMENT":

            break;
          case "DELETECOMMENT":

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
    this.children.push(new TreeNode(data))
  }
}


try {
  module.exports = NotesIndex
} catch (e) {
  window.NotesIndex = NotesIndex
}

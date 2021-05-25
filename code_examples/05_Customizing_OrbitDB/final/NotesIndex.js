"use strict"

class NotesIndex {
  constructor() {
    this._index = {
      notes: {},
      comments: {}
    }
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

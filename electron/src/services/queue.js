const EventEmitter = require('events')

/**
 * Represents a simple queue that extends the EventEmitter class.
 * An event is emitted when an item is added to an empty queue.
 */
class Queue extends EventEmitter {
  /**
   * Constructs a new empty Queue.
   */
  constructor() {
    super()
    this.items = []
  }

  /**
   * Adds an item to the end of the queue.
   * Emits a 'not-empty' event if the queue was previously empty.
   *
   * @param {*} item - The item to add to the queue.
   */
  push(item) {
    this.items.push(item)
    if (this.items.length === 1) {
      this.emit('not-empty')
    }
  }

  /**
   * Removes and returns the item from the front of the queue.
   *
   * @throws {Error} Throws an error if the queue is empty.
   * @returns {*} The item from the front of the queue.
   */
  pop() {
    const item = this.items.shift()
    if (!item) {
      throw new Error('Queue is empty')
    }
    return item
  }

  /**
   * Gets the item from the front of the queue without removing it.
   *
   * @returns {*} The item from the front of the queue or undefined if the queue is empty.
   */
  peek() {
    return this.items[0]
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns {boolean} True if the queue is empty, otherwise false.
   */
  isEmpty() {
    return this.items.length === 0
  }

  /**
   * Represents the queue as a string.
   *
   * @returns {string} A string representation of the queue's items.
   */
  toString() {
    return this.items.toString()
  }
}

module.exports = { Queue }

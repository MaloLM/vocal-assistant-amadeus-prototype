const EventEmitter = require('events')

/**
 * Dictionary class that extends EventEmitter to provide dictionary operations
 * and emits events upon certain operations.
 */
class Dictionary extends EventEmitter {
  /**
   * Initialize an empty dictionary.
   */
  constructor() {
    super()
    this.items = {}
  }

  /**
   * Static event types emitted by the Dictionary class.
   */
  static Event = {
    AddElement: 'add-element',
  }

  /**
   * Adds a new key-value pair to the dictionary and emits an 'add-element' event.
   *
   * @param {*} key - The key of the item.
   * @param {*} value - The value of the item.
   */
  add(key, value) {
    this.items[key] = value
    this.emit(Dictionary.Event.AddElement)
  }

  /**
   * Removes an item from the dictionary using the provided key.
   *
   * @param {*} key - The key of the item to remove.
   * @returns {any|null} - Returns the value of the removed item or null if not found.
   */
  pop(key) {
    const item = this.items[key]
    if (!item) {
      console.log(`---> ${item} was not found in the dictionnary`)
      return null
    }
    delete this.items[key]
    return item
  }

  /**
   * Finds the key for a given value.
   *
   * @param {*} value - The value to search for.
   * @returns {string|undefined} - Returns the key or undefined if not found.
   */
  getKey(value) {
    return Object.keys(this.items).find((key) => this.items[key] === value)
  }

  /**
   * Retrieves the value associated with a given key.
   *
   * @param {*} key - The key of the item.
   * @returns {*} - Returns the value associated with the key.
   */
  getValue(key) {
    return this.items[key]
  }

  /**
   * Checks if the dictionary is empty.
   *
   * @returns {boolean} - Returns true if the dictionary is empty, otherwise false.
   */
  isEmpty() {
    return Object.keys(this.items).length === 0
  }

  /**
   * Converts the dictionary to a string representation.
   * 
   * @returns {string} - Returns a stringified representation of the dictionary.
   */
  toString() {
    return JSON.stringify(this.items)
  }
}

module.exports = { Dictionary }

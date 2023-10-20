// Import the EventEmitter class from the 'events' module.
const { EventEmitter } = require('events')

// Create a new instance of EventEmitter and export it.
// This allows other modules to use this instance and listen to or emit events from/to it.
module.exports = new EventEmitter()

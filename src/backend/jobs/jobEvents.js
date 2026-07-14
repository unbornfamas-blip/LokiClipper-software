const EventEmitter = require("events");

class JobEvents extends EventEmitter {}

const jobEvents = new JobEvents();

module.exports = {
  jobEvents
};
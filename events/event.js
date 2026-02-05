import EventEmitter from "events";

//create instance of event emitter
const eventEmitter = new EventEmitter();

eventEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

// Emit the 'greet' event
eventEmitter.emit('greet', 'Alice');
eventEmitter.emit('greet', 'Bob');
const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

// let messageQueue = null;
// module.exports.initialize = (queue) => {
//   messageQueue = queue;
// };

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  if(req.method === 'GET') {
    console.log('ping');
  }

  res.writeHead(200, headers);
  // let movement = getRandom();
  let movement = messageQueue.dequeue() || getRandom();
  // refactor our movement variable to be a dequeued string
  res.write(JSON.stringify({direction: movement} ));
  // req.url

  // req.method ---> GET, POST, etc (type of request)
  // if res.method is GET, do something
  // res.write ---> body of the response
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};


// helper function
let getRandom = function() {
  let commands = ['left', 'right', 'up', 'down'];
  let r = Math.floor(Math.random() * commands.length)
  return commands[r];
};
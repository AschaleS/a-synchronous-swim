const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {

  if(req.method === 'GET') {
    console.log('ping');
  }

  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  let movement = getRandom();
  res.write(movement);
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
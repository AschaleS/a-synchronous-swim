const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.jpgImageFile = path.join('.', 'background.jpg');
module.exports.pngImageFile = path.join('.', 'background-image.png');

let retrievalPath;

let { jpgImageFile, pngImageFile} = module.exports;
////////////////////////////////////////////////////////

// let messageQueue = null;
// module.exports.initialize = (queue) => {
//   messageQueue = queue;
// };

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);


  if(req.method === 'GET') {
    ///additional logic that sorts the movement and image requests
    // IF /movement
    if (req.url === '/movement') {
      res.writeHead(200, headers);
      // let movement = getRandom();
      let movement = messageQueue.dequeue() || getRandom();
      res.write(JSON.stringify({direction: movement} ));
      res.end();

    } else if (req.url === '/background') {

      // console.log(backgroundImageFile, module.exports.backgroundImageFile)
     fs.readFile(retrievalPath, (err, data) => {
       if (err) {
         res.writeHead(404, headers);
         res.end();
         next();
       } else {
         res.writeHead(200, headers);
         res.write(data, 'binary');
         console.log('content type:', res.headers)
         res.end();
         next();
       }
     });
    }
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    // next();
  }


  if (req.method === 'POST') {
    console.log('content type:', req.contentType);
    if (req.url === '/background') {
      // create a buffer
      let imageFile = Buffer.alloc(0);
      req.on('data', (chunk) => {
      imageFile = Buffer.concat([imageFile, chunk]);
      })
      req.on('end', () => {
        let image = multipart.getFile(imageFile);
        console.log('Image Type:', image.type)
        // Check content type within image object
        let imagePath;
        if (image.type === 'image/jpeg') {
          imagePath = jpgImageFile;
          retrievalPath = jpgImageFile;
        } else {
          imagePath = pngImageFile;
          retrievalPath = pngImageFile;
        }
        // Write the data to the file path
        fs.writeFile(imagePath, image.data, (err) => {
          if (err) {
            res.writehead(404, headers);
            res.end();
          } else {
            res.writeHead(201, headers);
            res.end();
          }
          // res.end();
          // next();
        });
      })
    }
  }
};


// helper function
let getRandom = function() {
  let commands = ['left', 'right', 'up', 'down'];
  let r = Math.floor(Math.random() * commands.length)
  return commands[r];
};
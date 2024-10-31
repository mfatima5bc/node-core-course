import fs from "node:fs/promises";

// Memory usage: 1gb
// execution time: 3ms
// (async () => {
//   const destFile = await fs.open('text-copy.txt', 'w');
//   const result = await fs.readFile('test-1gb.txt'); // read all the file content in memory

//   await destFile.write(result);
// })()

// streams without streams rsrsrs
// memory 24 mb
// execution time: 4s
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const srcFile = await fs.open("test-1gb.txt", "r");

//   let bytesRead = -1;

//   while(bytesRead !== 0) {
//     const readResult = await srcFile.read();  // read just a chunk 
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }

//   }

//   console.timeEnd("copy");
// })();


// streams
// memory 32 mb
// execution time: 2s
(async () => {
  console.time("copy");
  const destFile = await fs.open("text-copy.txt", "w");
  const srcFile = await fs.open("test-1gb.txt", "r");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();
  console.log(readStream.readableFlowing);
  
  readStream.pipe(writeStream); // THIS PIPE METHOD LIMIT THE BUFFER TO ACCEPTABLE LEVELS VALUES SUCH THAR SOURCE AND DESTINATIONS OF DIFFERING SPEED WILL NOT OVERWHELM THE AVAILABLE MEMORY;
  console.log(readStream.readableFlowing);
  readStream.unpipe(writeStream);
  console.log(readStream.readableFlowing);

  readStream.on('end', () => {
    console.timeEnd("copy");
  });
  
})();
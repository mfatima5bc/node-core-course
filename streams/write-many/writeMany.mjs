// import fs from 'node:fs/promises';

// // 45 MB
// // 13% cpu
// // time: 1:09.666 (m:ss.mmm)
// (async () => {
//   console.time('writeMany');
//   const fileHandler = await fs.open('./streams/test.txt', 'w');

//   for (let i = 0; i <=1e6; i++) {
//     await fileHandler.write(`${i}\n`);
//   }

//   fileHandler.close();
//   console.timeEnd('writeMany');
// })()

// import fs from 'node:fs';
// // 27 mb
// // 12 % cpu
// // time: 7.733s
// (async () => {
//   console.time('writeMany');
//   fs.open('./streams/test.txt', 'w', (err, fd) => {
//     for (let i = 0; i <=1e6; i++) {
//       fs.writeSync(fd, `${i}\n`);
//     }
//     console.timeEnd('writeMany');
//   });
//   // fs.close(fd);
// })()


// import fs from 'node:fs';
// // 27 mb
// // 12 % cpu
// // time: 7.733s
// (async () => {
//   console.time('writeMany');
//   fs.open('./streams/test.txt', 'w', (err, fd) => {
//     for (let i = 0; i <=1e6; i++) {
//       const buff = Buffer.from(`${i}\n`, 'utf-8')
//       fs.writeSync(fd, buff);
//     }
//     console.timeEnd('writeMany');
//   });
//   // fs.close(fd);
// })()


// import fs from 'node:fs/promises';
// // DON'T DO IT THIS WAY!!!!
// // 265 mb memory
// // % cpu
// // time: 647.43 ms
// (async () => {
//   console.time('writeMany');
//   const fileHandler = await fs.open('./streams/test.txt', 'w');
//   const stream = fileHandler.createWriteStream();
//   for (let i = 0; i <=1e6; i++) {
//     const buff = Buffer.from(`${i}\n`, 'utf-8')
//     stream.write(buff);
//   }
//   console.timeEnd('writeMany');
//   // fs.close(fd);
// })()


import fs from "node:fs/promises";

// Execution Time: 300ms
// Memory Usage: 50MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);

  // 8 bits = 1 byte
  // 1000 bytes = 1 kilobyte
  // 1000 kilobytes = 1 megabyte

  // 1a => 0001 1010

  // const buff = Buffer.alloc(16383, "a");
  // console.log(stream.write(buff));
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));

  // console.log(stream.writableLength);

  // stream.on("drain", () => {
  //   console.log(stream.write(Buffer.alloc(16384, "a")));
  //   console.log(stream.writableLength);

  //   console.log("We are now safe to write more!");
  // });

  let i = 0;

  const numberOfWrites = 100000000; // 1000000000

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      // this is our last write
      if (i === numberOfWrites - 1) {
        return stream.end(buff);
      }

      // if stream.write returns false, stop the loop
      if (!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

  // resume our loop once our stream's internal buffer is emptied
  stream.on("drain", () => {
    // console.log("Drained!!!");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });
})();
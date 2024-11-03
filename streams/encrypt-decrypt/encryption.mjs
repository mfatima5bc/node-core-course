
// encryption/decryption => crypto
// hashing-salting => crypto
// compression => zLib
// decoding/encoding => buffer text-encoding/decoding

import { Transform } from 'node:stream';
import fs from 'node:fs/promises';

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    console.log(chunk.toString('utf-8'));
    for (let i = 0; i <= chunk.length; ++i) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] + 1;
    }
    callback(null, chunk);
    // this.push(chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open('test.txt', 'r');
  const writeFileHandler = await fs.open('write.txt', 'w');

  const size = readFileHandler.stat();

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();

  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
  
})()

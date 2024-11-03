import { Transform } from "node:stream";
import fs from "node:fs/promises";

class Decrypt extends Transform {
  constructor({ fileSize = 0, writableHighWaterMark, readableHighWaterMark }) {
    super({ readableHighWaterMark, writableHighWaterMark });
    this.fileSize = fileSize;
    this.percent = 0;
    this.process = []
  }

  _logTotalProcessed(chunkLength) {
    this.percent += (chunkLength / this.fileSize) * 100;
    const peace = Math.round(this.percent);

    if (
      peace % 5 === 0 &&
      !this.process.includes(
        this.percent.toFixed(0)
      )
    ) {
      this.process.push(this.percent.toFixed(0));
      console.log(`\nProcessing total... ${this.percent.toFixed(0)}%`);
    }
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i <= chunk.length; ++i) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] - 1;
    }
    this._logTotalProcessed(chunk.length);
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandler = await fs.open("write.txt", "r");
  const writeFileHandler = await fs.open("decrypted.txt", "w");

  const readStream = readFileHandler.createReadStream();
  const writeStream = writeFileHandler.createWriteStream();
  const { size } = await readFileHandler.stat();
  const decryption = new Decrypt({ fileSize: size });

  readStream.pipe(decryption).pipe(writeStream);
})();

import net from 'net';
import fs from 'node:fs/promises';
import path from 'node:path';

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    })
  });
}

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    })
  });
}

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  let fileHandler = await fs.open(filePath, 'r');
  let fileStream = fileHandler.createReadStream();

  const fileSize = (await fileHandler.stat()).size;

  let uploadedPercentage = 0;
  let bytesUploaded = 0;

  socket.write(`fileName: ${fileName}--------`);

  fileStream.on("data", async (data) => {
    if (!socket.write(data)) {
      fileStream.pause();
    }

    bytesUploaded += data.length;
    let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);

    if (newPercentage % 5 === 0 && newPercentage !== uploadedPercentage) {
      uploadedPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Uploading... ${uploadedPercentage}%`);
    }
  });

  socket.on("drain", () => {
    fileStream.resume()
  });

  fileStream.on("end", () => {
    console.log("The file was successfully uploaded")
    // fileHandler.close();
    socket.end()
  })
})


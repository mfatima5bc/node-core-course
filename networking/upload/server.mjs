import net from 'net';
import fs from 'node:fs/promises'

const server = net.createServer(() => {});


server.on("connection", (socket) => {
  console.log("New connection!");
  let fileHandler, fileStream;

  socket.on("data", async (data) => {
    if(!fileHandler) {
      socket.pause();

      const dividerIndex = data.indexOf('--------');
      const fileName = data.subarray(10, dividerIndex).toString('utf-8');

      fileHandler = await fs.open(`storage/${fileName}`, "w");
      fileStream = fileHandler.createWriteStream();

      fileStream.write(data.subarray(dividerIndex+7));
      socket.resume();
      fileStream.on('drain', () => {
        socket.resume();
      })
    } else {
      if(!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    if (fileHandler) console.log("Connection ended!");
    fileHandler.close();
    fileHandler = undefined;
    fileStream = undefined;
  });
});

server.listen(5050, "::1", () => {
  console.log("Upload server opened on ", server.address());
});

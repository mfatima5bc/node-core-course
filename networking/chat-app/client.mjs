import net from "net";
import readline from "readline/promises";

const PORT = 3008;
const HOST = '127.0.0.1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;
// this client is a socket
const client = net.createConnection(
  { host: HOST, port: PORT },
  async () => {
    console.info("Connected to the server!");

    const ask = async () => {
      const message = await rl.question("Enter a message> ");
      await moveCursor(0, -1);
      await clearLine(0);
      client.write(`${id}-message-${message}`);
    };
    ask();

    client.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      await clearLine(0);

      if (data.toString('utf-8').substring(0, 2) === 'id') { // when we are getting the id...
        id = data.toString('utf-8').substring(3);

        console.log(`Your id is ${id}!\n`)
      } else { // when we are getting a message
        
        console.log(data.toString("utf-8"));
      }
      ask();
    });
  }
);



client.on("end", () => {
  console.log("Connection was ended!");
});

import http from "node:http";

const agent = new http.Agent({ keepAlive: true });

const message = JSON.stringify({
  title: "Ihuu post!",
  message: "this is some text to read!",
});

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8050,
  method: "POST",
  path: "/create-post",
  headers: {
    "content-type": "application/json",
    name: "joe",
    "content-length": Buffer.byteLength(message, "utf-8"),
  },
});

// request.on("response", () => {});

// request.write(JSON.stringify({  }));
request.end(message);

request.on("response", (res) => {
  res.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
  res.on("end", () => {
    console.log("No more data in response!");
  });
});

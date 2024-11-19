import http from "http";

const port = 4080;
const hostname = "192.168.1.154";

const server = http.createServer((req, res) => {
  const data = { message: "hi there" };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
import http from "node:http";

const server = http.createServer();

server.on("request", (request, response) => {
  console.log("--------METHOD----------");
  console.log(request.method);

  console.log("--------URL-------");
  console.log(request.url);

  console.log("--------HEADERS-------");
  console.log(request.headers);
  const name = request.headers.name;

  console.log("--------BODY-------");

  let data = "";

  request.on("data", (chunk) => {
    // console.log(chunk.toString('utf-8'))
    data += chunk.toString();
  });

  request.on("end", () => {
    data = JSON.parse(data);

    console.log(data);
    console.log(name);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        message: `Post with title: ${data.title} was created by ${name}`,
      }),
    );
  });
});

server.listen(8050, () => {
  console.log("server is running on port 8050! 🚀");
});

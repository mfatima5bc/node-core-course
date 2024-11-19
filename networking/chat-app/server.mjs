import net from 'net';

const PORT = 3008;
const HOST = '127.0.0.1';

const server = net.createServer();
const clients = [];

server.on('connection', (socket) => {
  console.log('A new Connection to the server!');
  const clientId = clients.length + 1;

  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.write(`id-${clientId}`);

  socket.on('data', (data) => { // socket is a duplex stream
    const dataString = data.toString('utf-8')
    const id = dataString.substring(0, dataString.indexOf('-'));
    const message = dataString.substring(dataString.indexOf('-message-') + 9, dataString.length);
    clients.map(({socket: s}) => {
      s.write(`> user ${id}: ${message}`);
    });
  });

  //  broadcasting a message when everyone leaves the chat room
  socket.on('end', () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  socket.on('error', () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({socket, id: clientId.toString()});
});

server.listen(PORT, HOST, () => {
  console.log('Opened server on', server.address());
});

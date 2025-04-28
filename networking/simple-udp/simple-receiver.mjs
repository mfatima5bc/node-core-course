// send segments
import dgram from 'node:dgram'

const receiver = dgram.createSocket('udp4')

receiver.on('message', (message, rinfo) => {
  console.log(`Server got: ${message}, from ${rinfo.address}:${rinfo.port}`)
})

receiver.bind({address: '127.0.0.1', port: 8000})

receiver.on('listening', () => {
  console.log(`Server listening to ${JSON.stringify(receiver.address())}`)
})


const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bits)

console.log(memoryContainer)
memoryContainer[0] = 0xf4
memoryContainer[0] = 0x32
memoryContainer.writeInt8(-32, 2)
memoryContainer[0] = 0xff
console.log(memoryContainer[0])
console.log(memoryContainer[1])
console.log(memoryContainer.readInt8(2))
console.log(memoryContainer[3])

console.log(memoryContainer.toString('hex'))

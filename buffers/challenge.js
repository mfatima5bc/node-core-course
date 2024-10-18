// 0100 1000 0110 1001 0010 0001
const {Buffer} = require('node:buffer')

/*
const container = Buffer.alloc(6) // 24 bits / 8 => bytes

container[0] = 0x48;
container[1] = 0x69;
container[2] = 0x21;
*/
/*
const buff = Buffer.from([0x48, 0x69, 0x21])
console.log(buff.toString('utf-8'))
*/

/*
const buff = Buffer.from("486921", "hex")
console.log(buff.toString('utf-8'))
*/

const buff = Buffer.from("Hi!", "utf-8")
console.log(buff)
console.log(buff.toString("utf-8"))

const buff = Buffer.alloc(10000, 0); // this takes time

const unsafeBuffer = Buffer.allocUnsafe(10000) // faster then alloc bat 
// Buffer.from() // use allocUnsafe behind de scenes
// Buffer.concat() // use allocUnsafe behind de scenes

for (let i =0; i < unsafeBuffer.length; i ++) {
  if (unsafeBuffer[i] !== 0) {
    console.log(`Element at position ${i} has value ${unsafeBuffer[i].toString(2)}`)
  }
}

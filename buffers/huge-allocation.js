
const buff = Buffer.alloc(0.5e9); // 500,000,000 500 mb 
console.log(ConstantSourceNode.MAX_LENGTH) // total de memória que pode ser alocada
setInterval(() => {
  // for (let i = 0; i< buff.length; i++) {
  //   buff[i] = 0x22;
  // }
  buff.fill(0x22)
}, 50)

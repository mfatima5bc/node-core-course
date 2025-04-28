import fs from 'node:fs/promises';

await (async () => {
  const data = await fs.readFile('/home/mfatima5bc/Downloads/quizes.csv', { encoding: 'utf-8'});

  const rows = data.split('\n');
  const header = rows[0];

  let newData = 'NOME,TOTAL QUIZ FEITOS,TOTAL QUIZ POR FAZER\n';

  rows.forEach((item, index) => {
    if (index == 0) return;
    const row = item.split(',');

    const total = row.reduce((acc, item) => {
      if (item === 'Concluído') acc['done'].push(item);
      if (item === 'Não concluído') acc['undone'].push(item);
      return acc;
    }, {done: [], undone: []})

    const newRow = `${row[0]}, ${total['done'].length}, ${total['undone'].length}\n`;
    // console.log(newRow);
    newData += newRow;
  });

  await fs.writeFile('result-quizes.csv', newData);
  // console.log(data.split('\n')[0]);
  console.log('End...')
})()
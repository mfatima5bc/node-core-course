import dns from 'node:dns/promises';

(async () => {
  const result = await dns.lookup("google.com");
  console.log(result);
})()
 

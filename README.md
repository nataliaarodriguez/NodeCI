# AdvancedNodeStarter
Starting project for a course on Advanced Node @ Udemy

npm start dev
npm run dev -- corre front y back
npm install redis

client.flushall(); /limpia todo de redis.
client.set('color,'red','EX', 5) //expira en 5 segundos

para matar pkill node

/*
const redis = require('redis')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl);
*/

//client (tira datos)
/*
client.set('hi','there');
client.get('hi',(err, value)=>console.log(value) );
client.get('hi', console.log);
*/
//
// const redisValues = {
//     spanish: {
//         red:'rojo',
//         oranje: 'naranja',
//         blue: 'azul'
//     },
//     german: {
//         red: 'rot',
//         orange: 'orange',
//         blue: 'blau'
//     }
// }
//
// client.set('german','red', 'rot');
// client.get('german', 'red',console.log);
// client.set('colors', JSON.stringify({'red': 'rot'}));
// client.get('colors', (e,val)=> console.log(JSON.parse(val)));

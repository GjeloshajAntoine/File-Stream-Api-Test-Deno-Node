import http  from 'node:http';

const app = http.createServer((req, res) => {
    console.log('req',req.url);
    const body = new Promise(resolve => req.on('data',()) )
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
    console.log('has written');
  });


app.listen(8080, '127.0.0.1', () => { 
    console.log('listening');
})

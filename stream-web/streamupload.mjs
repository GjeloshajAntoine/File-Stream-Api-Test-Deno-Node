import http  from 'node:http';
import { readFile } from 'node:fs/promises';

const memu = () => process.memoryUsage().rss / (1024 * 1024);

const app = http.createServer(async (req, res) => {
    console.log('req',req.url);

    if (req.url === '/upload') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const page = await readFile('index.html');
        return res.end(page.toString());
    }

    
    if (req.url === '/uploadstream') {
        console.log('name:', req.headers['x-file-name']);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        req.on('data', data => {
            // process.stdout.cursorTo(0);
            // process.stdout.moveCursor(0,0)
            // process.stdout.write(req.socket.bytesRead+"");
            // process.stdout.write(memu()+"");
            // console.log('memu',memu());
            // console.log('data ===============',(data+"").length);
        });
        const page = await readFile('index.html');
        return res.end(page.toString());
    }

    req.on('data', data => {
        console.log('data',data+"");
    });
    req.on('end',o=>{
        console.log('done')
    })

    console.log('body', req.headers['Content-Type']);
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
    console.log('has written');
  });


app.listen(8081, '0.0.0.0', () => { 
    console.log('listening');
})

//curl --header "Content-Type: application/json"   --request POST   --data '{"username":"x","password":"y"}'   http://localhost:8081
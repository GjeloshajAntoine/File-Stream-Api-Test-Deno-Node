import http  from 'node:http';

const app = http.createServer(async (req, res) => {
    console.log('req',req.url);
    const body = new Promise(resolve => { let da=""; req.on('data',data=>da+=data); req.on('end',o=>resolve(da))} )

    console.log('body', req.headers['content-type'],await body);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
    console.log('has written');
  });


app.listen(8081, '0.0.0.0', () => { 
    console.log('listening');
})

//curl --header "Content-Type: application/json"   --request POST   --data '{"username":"x","password":"y"}'   http://localhost:8081
const headers = {
    'Access-Control-Allow-Origin': '*'
}

require("http").createServer((request, response) => {
    response.writeHead(200, headers);
    require("stream").pipeline( // Pipes from each stream to the next ending in a callback to handle errors
      require("fs").createReadStream( // Reads the file at the specified path.
        require("path").join(".", request.url) // Forces the file path to start with this directory,
      ),                                       // so no absolute paths or ../ing upward.
      response, // This is a writable stream so the file read stream pipes into the server response stream.
      (error, value) => { console.log(request.url, error); } // This callback handles the error & we use it
    )                                                        // here to log the filepath.
 } ).listen(9999); // Actually starts the server listening on this port.
  
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use("/public", express.static(__dirname + '/public'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
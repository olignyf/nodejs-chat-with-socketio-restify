const restify = require('restify');
const fs = require('fs');
const socketio = require('socket.io');
const path = require('path');

const http_server = restify.createServer({name:'test'});
const io = socketio.listen(http_server.server, {path: '/socket.io'});

//Serve public directory
http_server.get('/*', restify.plugins.serveStatic({
  directory: path.join(__dirname, 'public') 
}));

http_server.get('/', (req, res, next) => { 
	fs.readFile(path.join(__dirname, 'public/index.html'), function (err, data) {
    if (err) {
        next(err);
        return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
});

io.on('connection', socket => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('message', message => {
		console.log('message: ' + message);
		//Broadcast the message to everyone
		io.emit('message', message);
	});
});

http_server.listen(3000, () => {
	console.log('listening on port 3000');
});

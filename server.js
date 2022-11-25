const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app)

const io = require('socket.io')(server, { cors: { origin: "*" } });
server.on('listening', function () {
    // console.log("listening");
});
io.on('connection', function (socket) {
    socket.on('test', (msg) => {
        console.log('test: ' + msg);
    });
    io.emit('from_backend', "This message is from backend");

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

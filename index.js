const app = require('http').createServer();
const io = (module.exports.io = require('socket.io')(app));

io.set('origins', '*:*');

const PORT = process.env.PORT || 2112;

const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});

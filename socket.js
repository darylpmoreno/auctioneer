var server = require('http').Server();

var io = require('socket.io')(server);

var Redis = require('ioredis');
var redis = new Redis();

redis.subscribe('bids-channel');

redis.on('message', function (channel, message) {
    message = JSON.parse(message);
    io.emit(channel + message.data.item_id + ':' + message.event, message.data);
});

var usersConnected = 0;
io.on('connection', function (socket) {
    usersConnected++;
    socket.on('disconnect', function () {
        usersConnected--;
        io.emit('visitorsConnected', usersConnected);
    });
    io.emit('visitorsConnected', usersConnected);
});


server.listen(3000);

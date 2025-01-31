module.exports = (io) => {
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a chat room
    socket.on('join_room', (room) => {
    socket.join(room);
    });

    // Handle new message
    socket.on('new_message', (data) => {
    io.to(data.room).emit('receive_message', {
        sender: data.sender,
        message: data.message,
        timestamp: new Date()
    });
    });

    // Handle typing status
    socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('user_typing', data.user);
    });

    socket.on('disconnect', () => {
    console.log('Client disconnected');
    });
});
};


const { Server } = require('socket.io');

let io;
module.exports = (req, res) => {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, { path: "/api/socket.js", addTrailingSlash: false });
    let admin = null;

    io.on('connection', socket => {
      socket.on('admin-login', () => { admin = socket; });
      socket.on('visitor-msg', d => { if(admin) admin.emit('new-msg', {id: socket.id, text: d.text}); });
      socket.on('admin-reply', d => { io.to(d.visitorId).emit('admin-msg', d.text); });
    });

    res.socket.server.io = io;
  }
  res.end();
};

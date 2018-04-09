const { io } = require('./index.js');

const connectedUsers = [];

const {
  VERIFY_USER,
  USER_CONNECTED,
  LOGOUT,
  USERS_CHANGED,
  PRIVATE_CHAT,
  COMMUNITY_CHAT
} = require('./Events');

const { createChat, createMessage, createUser } = require('./Factories');

module.exports = (socket) => {
  console.log(`Socket Id: ${socket.id}`);

  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({
        isUser: true,
        user: null
      });
    } else {
      callback({
        isUser: false,
        user: createUser({ name: nickname, socketId: socket.id })
      });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    addUser(connectedUsers, user);

    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);

    // bağlı kullanıcı listesi tekrar gönderiliyor
    io.emit(USERS_CHANGED, connectedUsers);
  });

  socket.on(LOGOUT, (user) => {
    removeUser(connectedUsers, user);

    // bağlı kullanıcı listesi tekrar gönderiliyor
    io.emit(USERS_CHANGED, connectedUsers);
  });

  socket.on(PRIVATE_CHAT, (socketId, sender, receiver, text, date) => {
    socket.to(socketId).emit('privateMessage', sender, receiver, text, date);
  });

  socket.on(COMMUNITY_CHAT, (sender, text, date) => {
    io.emit(COMMUNITY_CHAT, sender, text, date);
  });
};

function isUser(userList, username) {
  let result = false;

  userList.forEach((user) => {
    if (user.name === username) {
      result = true;
    }
  });

  return result;
}

function addUser(userList, user) {
  userList.push(user);
}

function removeUser(userList, user) {
  const index = userList.indexOf(user);
  userList.splice(index, 1);
}

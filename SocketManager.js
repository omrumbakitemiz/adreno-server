const { io } = require('./index.js');

// let connectedUsers = { };
const connectedUsers2 = [];

const { VERIFY_USER, USER_CONNECTED, LOGOUT, USERS_CHANGED } = require('./Events');

const { createChat, createMessage, createUser } = require('./Factories');

module.exports = (socket) => {
  console.log(`Socket Id: ${socket.id}`);

  // socket.on(VERIFY_USER, (nickname, callback) => {
  socket.on(VERIFY_USER, (nickname, callback) => {
    // if (isUser(connectedUsers, nickname)) {
    if (isUser2(connectedUsers2, nickname)) {
      callback({
        isUser: true,
        user: null
      });
    }
    else {
      callback({
        isUser: false,
        user: createUser({ name: nickname })
      });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    // connectedUsers = addUser(connectedUsers, user);
    addUser2(connectedUsers2, user);

    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers2);

    // bağlı kullanıcı listesi tekrar gönderiliyor
    io.emit(USERS_CHANGED, connectedUsers2);
  });

  socket.on(LOGOUT, (user) => {
    // connectedUsers = removeUser(connectedUsers, username);
    removeUser2(connectedUsers2, user);

    // bağlı kullanıcı listesi tekrar gönderiliyor
    io.emit(USERS_CHANGED, connectedUsers2);
  });
};

function isUser2(userList, username) {
  let result = false;

  userList.forEach((user) => {
    if (user.name === username) {
      result = true;
    }
  });

  return result;
}

function addUser2(userList, user) {
  userList.push(user);
}

function removeUser2(userList, user) {
  const index = userList.indexOf(user);
  userList.splice(index, 1);
}

// function isUser(userList, username) {
//   return username in userList;
// }

// function addUser(userList, user) {
//   const newList = Object.assign({}, userList);
//   newList[user.name] = user;
//   return newList;
// }

// function removeUser(userList, username) {
//   const newList = Object.assign({}, userList);
//   delete newList[username];
//   return newList;
// }

const { io } = require('./index.js');

let connectedUsers = { };

const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('./Events');

const { createChat, createMessage, createUser } = require('./Factories');

module.exports = (socket) => {
  console.log(`Socket Id: ${socket.id}`);

  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({
        isUser: true, user: null
      });
    }
    else {
      callback({
        isUser: false, user: createUser({ name: nickname })
      });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);

    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);

    console.log(connectedUsers);
  });

  socket.on(LOGOUT, (username) => {
    connectedUsers = removeUser(connectedUsers, username);

    console.log(connectedUsers);
  });
};

function addUser(userList, user) {
  const newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

function isUser(userList, username) {
  return username in userList;
}

function removeUser(userList, username) {
  const newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

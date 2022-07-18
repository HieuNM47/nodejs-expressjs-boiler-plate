const addUser = (users, username, socketId) => {
    users.push({username, socketId})
}
const removeUser = (users, socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
const getUser = (users, username) => {
    return users.find(user => user.user_name === username)
}
const getUserBySocketId= (users, socketId) => {
    return users.find(user => user.socketId === socketId)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserBySocketId
};
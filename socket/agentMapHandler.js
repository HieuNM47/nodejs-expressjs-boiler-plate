module.exports = (io, socket) => {
    const connectOmni = (username) => {
       console.log(username);
    }
    socket.on("connected", connectOmni);
}
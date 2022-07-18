var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const { body, validationResult } = require('express-validator');
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");
var http = require("http");
var mysql   = require('mysql');
const { use } = require("./routes/api");
const {addUser,removeUser,getUser, getUserBySocketId} = require('./helpers/user');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Create HTTP server. 
 */

var server = http.createServer(app);

/**
 * socket
 */
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//To allow cross-origin requests
app.use(cors());
app.set("view engine", "ejs");


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.BD_DATA
});
var mySqlConnect = 1; 
con.connect(function(err) {
  if (err) {
      mySqlConnect = 0;
  }else{
      console.log("MySql Connected!!!")  
  }  
});

function promiseQuery(query) {
  return new Promise((resolve, reject) => {
      con.query(query, (err, results) => {
          if (err) {
              return reject(err);
          }
          resolve(results);
      })
  })
}
async function getUsersAll() {
  let param = await promiseQuery(`select user_name, user_email from kb_users`);
  return param;
}
async function updateDataUser(userName = '', socketId , disconnect = false) {
  var sql  = `UPDATE ` + `kb_users` + ` SET ` + `socket_id` + `='${socketId}' AND is_online=1 WHERE ` + `user_name` + `='${userName}'`;
  if(disconnect){
    sql  = `UPDATE ` + `kb_users` + ` SET ` + `socket_id` + `=null AND is_online=0  WHERE ` + `socket_id` + `='${socketId}'`;
  }
  let param = await promiseQuery(sql);
  return param;
}


 io.on("connection" ,async function (socket) {
    socket.on("connected",async username => {
        try {
          var result = await updateDataUser(username, socket.id);
          console.log(result);
        } catch (error) {
          console.log(error);
        }
    })
    socket.on("disconnect",async function () {
        try {
          var result = await updateDataUser('', socket.id ,true);
          console.log(result);
        } catch (error) {
            console.log(error);
        }
    });
})
app.io = io;

app.post("/receive-information-not-ready-tdv", [
    body('data.*.username').notEmpty(),
    body('data.*.time_not_ready_minutes').notEmpty(),
    body('data.*.time_shift_not_ready').notEmpty(),
    body('data.*.text_custom_to_omni').notEmpty(),
  ],function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(401).json({status: 500,message:'Gửi thất bại',errors: errors.array()});
      }
      var count = 0;
      if(req.body.data){
        req.body.data.forEach(element => {
          const user = getUser(element.username);
          if(user){
            count++;
            req.app.io.to(user.socketId).emit('serve-send-noti-agentmap', element.text_custom_to_omni);  
          }else{
            console.log('User khong connect: ' + element.username);
          }
         });
      }
      return res.status(200).json({status: 200,message:'Gửi thành công '+ count});

    } catch (error) {
      console.log(error);
      return res.status(200).json({status: 500,message:'Gửi thất bại'});
    }
});


//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});


var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}

module.exports = app;

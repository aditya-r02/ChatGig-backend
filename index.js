const express = require('express');
const { createServer } = require("http");
const {Server} = require('socket.io');
require('dotenv').config();
const app = express();
const httpServer = createServer(app);
const cors = require('cors');
const server = createServer(app);
const cookieParser = require('cookie-parser')
const io = new Server(httpServer, { 
    cors: {
        origin: ["*","http://localhost:3000"]
      }
 });
 
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const connect = require('./Services/Database'); 
connect(); 
 
app.get("/", (req, res)=>{
    res.send('<p>hello</p><script src="/socket.io/socket.io.js"></script><script>const socket = io();</script>')
}) 

let map = {};
 
io.on('connection', (socket)=>{
    //console.log("a user connected: "+socket.id);

    socket.on("setSocketId", (userName)=>{
        map[userName] = socket.id; 
        //console.log(userName + " "+ socket.id + " "+map[userName]);
    })

    socket.on("sendMessage", (userName, currentUserName, message)=>{
        const socketId = map[userName] || null;
        //console.log(socketId);
        if (socketId!==null){
            //console.log("forwarding you message")
            
            socket.to(socketId).emit("forwardMessage");
        } 
    })

    socket.on('disconnect', () => { 
        //console.log('user disconnected');
        
      });
})

httpServer.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
})

const route = require('./routes/Route');
app.use("/api/v1", route);
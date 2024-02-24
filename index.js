const express = require('express');
const {Server} = require('socket.io');
const {createServer} = require('node:http')
require('dotenv').config();
const app = express();
const cors = require('cors');
const server = createServer(app);
const cookieParser = require('cookie-parser')
const io = new Server(server);

const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const connect = require('./Services/Database'); 
connect(); 
 
app.get("/", (req, res)=>{
    res.send('<p>hello</p><script src="/socket.io/socket.io.js"></script><script>const socket = io();</script>')
}) 
 
io.on('connection', (socket)=>{
    console.log("a user connected");
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})

server.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
})

const route = require('./routes/Route');
app.use("/api/v1", route);
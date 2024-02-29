import express from 'express'
import cors from 'cors'
import { Server }  from 'socket.io'
import {  createServer } from 'http'
import path from 'path'

const app =express()

app.use(cors());

app.use(express.static('dist'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4173",
    methods: ["GET", "POST"],
    credentials:true
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("SERVER RUNNING 3000" );
});




// import express from 'express'
// import http from 'http'
// import {Server} from 'socket.io'
// import cors from 'cors'

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server,{
//     cors:{
//         origin:"http://localhost:5173",
//     methods:["GET","POST"],
//     credentials:true
//     }
// });

// app.use(cors({
//     origin:"http://localhost:5173",
//     methods:["GET","POST"], 
//     credentials:true
// }))
// io.on('connection', (socket) => { 
//     console.log('A user connected',socket.id);

//     const emailToSocketMap =new Map()
//     const socketIdToEmail =new Map()
//     socket.on("room:join",(data) =>{
//         const {email,roomId} =data 
//         console.log(email,roomId);
//         emailToSocketMap.set(email,socket.id)
//         socketIdToEmail.set(socket.id,email)
//         io.to(roomId).emit("user:joined",{email,id:socket.id})
//      socket.join(roomId)
//         io.to(socket.id).emit("room:join",data)
//     })
//     // socket.on('disconnect', () => {
//     //     console.log('User disconnected');
//     // });

//     // socket.on('chat message', (msg) => {
//     //     io.emit('chat message', msg);
//     // });
// });

// server.listen(3001, () => {
//     console.log('Server is listening on port 3001');
// });


// import express from 'express'
// import cors from 'cors'
// import { Server }  from 'socket.io'
// import {  createServer } from 'http'

// const app = express()


// app.use(cors());

// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("SERVER RUNNING 3001");
// });
const express = require("express");
const mongoose = require("mongoose");
const Chat = require("./Models/chat");
const {vrifyToken} =  require("./utils/jwtToen")
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  userJoin
} = require("./utils/users");

const users = require("./Routes/users");

const app = express();
const mongoDB = "mongodb://127.0.0.1/ChatApp";

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("could not connect to mongoDB"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

// Socket server
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const isValidJwt = (header) => {
  const token = header.split(' ')[1];
  return vrifyToken(token)
};

// io.of('/test');
io.use((socket, next) => {
  const header = socket.handshake.headers['authorization'];
  if (isValidJwt(header)) {
    return next();
  }
  return next(new Error('authentication error'));
});
io.on('connection', (socket) => {
  socket.on('room', room => {
    console.log(room);
    socket.join(room);
  });
});

io.on("connection", (Socket) => {
  console.log("Socket is active to be connected");
  Socket.on("joinroom", ({ user, roomid }) => {
    const userx = userJoin(Socket.id, user, roomid);
    Socket.join(userx.room);
    io.to(userx.room).emit("intro-mssg", userx.username);
  });

  Socket.on("sendmssg", async ({ user, currentMssg }) => {
    const chat = new Chat({
      username: user,
      message: currentMssg
    });
  
    try {
      await chat.save();
    } catch (err) {
      console.log("Error", err);
    }
    io.emit("getmssg", { user, currentMssg });
  });
});

//Express Server

app.get("/", (req, res) => {
  res.send("request successfully sent!");
});

app.use("/users", users);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

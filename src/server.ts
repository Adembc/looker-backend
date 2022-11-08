import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import socketio, { Socket } from "socket.io";
import socketJob from "./socket/index";

dotenv.config({ path: `${__dirname}/../config.env` });
import app from "./app";
const server2 = http.createServer(app);

server2.listen(6001, () => {
  console.log("server 2 running on port 6001");
});

// connect database
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Database Connect Successfully  :)"))
  .catch((err) => console.error(err));
// run server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... ON ${process.env.NODE_ENV} MODE`);
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//@ts-ignore
const io = socketio(server2, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowRequest: (req, callback) => {
      const noOriginHeader = req.headers.origin === undefined;
      callback(null, noOriginHeader);
    },
  },
});
io.on("connection", (socket: Socket) => {
  socketJob(socket, io);
});

// error handling
process.on("unhandledRejection", (err: { name: string; message: string }) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

import mongoose from "mongoose";
import dotenv from "dotenv";
import terminate from "./helper/terminate";

dotenv.config({ path: `${__dirname}/../config.env` });
import app from "./app";
// export const server2 = http.createServer(app);

// server2.listen(5000, () => {
//   console.log("server 2 running");
// });

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
  .then(() => console.log("Database Connect Successfully :)"))
  .catch((err) => console.error(err));
// run server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... ON ${process.env.NODE_ENV} MODE`);
});
// const io = socketio(server2, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "OPTIONS"],
//     allowRequest: (req, callback) => {
//       const noOriginHeader = req.headers.origin === undefined;
//       callback(null, noOriginHeader);
//     },
//   },
// });

// error handling
// process.on("unhandledRejection", (err: { name: string; message: string }) => {
//   console.log("UNHANDLED REJECTION! Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
const exitHandler = terminate(server, {
  coredump: false,
  timeout: 500,
});

process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));

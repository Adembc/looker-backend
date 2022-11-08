"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server2 = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const terminate_1 = __importDefault(require("./helper/terminate"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const index_1 = __importDefault(require("./socket/index"));
dotenv_1.default.config({ path: `${__dirname}/../config.env` });
const app_1 = __importDefault(require("./app"));
exports.server2 = http_1.default.createServer(app_1.default);
exports.server2.listen(6001, () => {
    console.log("server 2 running on port 6001");
});
// connect database
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => console.log("Database Connect Successfully   :)"))
    .catch((err) => console.error(err));
// run server
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}... ON ${process.env.NODE_ENV} MODE`);
});
app_1.default.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//@ts-ignore
const io = (0, socket_io_1.default)(exports.server2, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowRequest: (req, callback) => {
            const noOriginHeader = req.headers.origin === undefined;
            callback(null, noOriginHeader);
        },
    },
});
io.on("connection", (socket) => {
    (0, index_1.default)(socket, io);
});
// error handling
// process.on("unhandledRejection", (err: { name: string; message: string }) => {
//   console.log("UNHANDLED REJECTION! Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
const exitHandler = (0, terminate_1.default)(server, {
    coredump: false,
    timeout: 500,
});
process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));

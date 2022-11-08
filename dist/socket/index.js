"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(socket, io) {
    socket.on("joinRoom", async (data) => {
        console.log(data);
        socket.join(data.categoryId);
        // add user to room
        // const room = await RoomModel.findOne({
        //   category: data?.category,
        //   users: { $nin: data.user },
        // });
        // if (room) {
        //   room.users = [...room.users, data?.userId];
        //   await room.save();
        // }
    });
    //Listten for chat-msg
    socket.on("chat-message", (data) => {
        io.to(data.categoryId).emit("message", data);
        // ChatModel.create({
        //   user: data?.user,
        //   room: data.roomId,
        //   content: data.msg,
        // }) ;
    });
    //   socket.on("leave-room", (data) => {
    //     io.to();
    //   });
}
exports.default = default_1;

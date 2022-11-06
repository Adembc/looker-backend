import { Socket } from "socket.io";
import { ChatModel } from "../database/model/chatModel";
import { RoomModel } from "../database/model/roomModel";

export default function (socket: Socket, io) {
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
    // });
  });

  //   socket.on("leave-room", (data) => {
  //     io.to();
  //   });
}

import { Socket } from "socket.io";

export default function (socket: Socket, io) {
  socket.on(
    "joinRoom",
    (data) => {
      console.log(data);
      socket.join(data.categoryId);
    }
    // add user to room
  );

  //Listten for chat-msg
  socket.on("chat-message", (data) => {
    io.to(data.categoryId).emit("message", data);
    // save msg to database
  });

  //   socket.on("leave-room", (data) => {
  //     io.to();
  //   });
}

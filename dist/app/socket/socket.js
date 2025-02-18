"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined`);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
/*
export const notifyBloodRequest = async (
  bloodRequest: any,
  io: SocketIOServer
) => {
  const { donorInfo, location } = bloodRequest;

  const eligibleDonors = await prisma.user.findMany({
    where: {
      blood: donorInfo?.blood,
      address: {
        contains: location,
      },
    },
  });

  eligibleDonors.forEach((donor: User) => {
    io.to(donor.id).emit("blood_request", {
      message: `Urgent: Blood donation needed for ${donorInfo?.blood} in ${location}`,
      requestDetails: bloodRequest,
    });
  });
};
*/ 

import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};
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
import prisma from "../../shared/prisma"
import AppError from "../../error/AppError"
import { ObjectId } from "bson"

// Register or update FCM token
const registerToken = async (userId: string, token: string, device?: string): Promise<any> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format")
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  // Check if token already exists
  const existingToken = await prisma.fCMToken.findUnique({
    where: { token },
  })

  if (existingToken) {
    // If token exists but for a different user, update it
    if (existingToken.userId !== userId) {
      return await prisma.fCMToken.update({
        where: { token },
        data: {
          userId,
          device,
          updatedAt: new Date(),
        },
      })
    }

    // If token exists for the same user, just update the timestamp
    return await prisma.fCMToken.update({
      where: { token },
      data: {
        device,
        updatedAt: new Date(),
      },
    })
  }

  // Create new token
  return await prisma.fCMToken.create({
    data: {
      userId,
      token,
      device,
    },
  })
}

// Remove FCM token
const removeToken = async (token: string): Promise<any> => {
  const existingToken = await prisma.fCMToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    throw new AppError(404, "Token not found")
  }

  return await prisma.fCMToken.delete({
    where: { token },
  })
}

// Get all tokens for a user
const getUserTokens = async (userId: string): Promise<any[]> => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError(400, "Invalid user ID format")
  }

  return await prisma.fCMToken.findMany({
    where: { userId },
  })
}

// Get all tokens for users in a district
const getDistrictTokens = async (district: string): Promise<any[]> => {
  // Find all users in the district
  const users = await prisma.user.findMany({
    where: { district },
    select: { id: true },
  })

  const userIds = users.map((user) => user.id)

  // Find all tokens for these users
  const tokens = await prisma.fCMToken.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  })

  return tokens
}

export const FCMTokenService = {
  registerToken,
  removeToken,
  getUserTokens,
  getDistrictTokens,
}


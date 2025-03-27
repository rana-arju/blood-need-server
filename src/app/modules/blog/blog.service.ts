import type { IBlog, IBlogFilters } from "./blog.interface"
import { paginationHelpers } from "../../helpers/paginationHelper"
import type { IPaginationOptions } from "../../interface/pagination"
import type { IGenericResponse } from "../../interface/common"
import AppError from "../../error/AppError"
import { ObjectId } from "bson"
import prisma from "../../shared/prisma"

import { Prisma } from "@prisma/client"

const getAllBlogs = async (
  filters: IBlogFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<any[]>> => {
  const { searchTerm, userId, tags } = filters
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

  const andConditions: Prisma.BlogWhereInput[] = []

  // Search term condition
  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        { tags: { has: searchTerm } },
      ],
    })
  }

  // Filter by author
  if (userId) {
    andConditions.push({ userId })
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    andConditions.push({ tags: { hasSome: tags } })
  }

  const whereConditions: Prisma.BlogWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  const total = await prisma.blog.count({ where: whereConditions })

  return {
    meta: { page, limit, total },
    data: result,
  }
}


const getBlogById = async (id: string): Promise<any> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blog ID format")
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!blog) {
    throw new AppError(404, "Blog not found")
  }

  return blog
}

const createBlog = async (userId: string, payload: IBlog): Promise<any> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  // Set the author ID
  payload.userId = userId


  const result = await prisma.blog.create({
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  return result
}

const updateBlog = async (id: string, userId: string, payload: Partial<IBlog>): Promise<any> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blog ID format")
  }

  // Check if blog exists
  const blog = await prisma.blog.findUnique({
    where: { id },
  })

  if (!blog) {
    throw new AppError(404, "Blog not found")
  }

  // Check if user is the author or an admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  if (blog.userId !== userId && user.role !== "admin" && user.role !== "superadmin") {
    throw new AppError(403, "You are not authorized to update this blog")
  }



  const result = await prisma.blog.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  return result
}

const deleteBlog = async (id: string, userId: string): Promise<any> => {
  if (!ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid blog ID format")
  }

  // Check if blog exists
  const blog = await prisma.blog.findUnique({
    where: { id },
  })

  if (!blog) {
    throw new AppError(404, "Blog not found")
  }

  // Check if user is the author or an admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(404, "User not found")
  }

  if (blog.userId !== userId && user.role !== "admin" && user.role !== "superadmin") {
    throw new AppError(403, "You are not authorized to delete this blog")
  }

  const result = await prisma.blog.delete({
    where: { id },
  })

  return result
}

export const BlogService = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
}
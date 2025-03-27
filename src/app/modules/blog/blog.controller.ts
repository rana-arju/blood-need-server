import type { Request, Response } from "express"
import { BlogService } from "./blog.service"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import pick from "../../shared/pick"
import { blogFilterableFields } from "./blog.constant"
import { paginationFields } from "../../constants/pagination"

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await BlogService.getAllBlogs(filters, paginationOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BlogService.getBlogById(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  })
})

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id!
  const result = await BlogService.createBlog(userId, req.body)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  })
})

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  console.log("body", req.params);
  
  const { id } = req.params
  const userId = req.user?.id!
  const result = await BlogService.updateBlog(id, userId, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog updated successfully",
    data: result,
  })
})

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user?.id!
  const result = await BlogService.deleteBlog(id, userId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  })
})

export const BlogController = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
}


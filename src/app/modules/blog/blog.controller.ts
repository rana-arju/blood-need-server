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






export const BlogController = {
  getAllBlogs,
  getBlogById,

}


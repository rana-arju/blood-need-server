import type { Request, Response } from "express"
import { UserService } from "./user.service"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import pick from "../../shared/pick"
import { paginationFields } from "../../constants/pagination"
import { userFilterableFields } from "./user.constant"
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)


  const result = await UserService.getAllUsers(filters, paginationOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  })
})

const createUser = catchAsync(async (req: Request, res: Response) => {

 
  const result = await UserService.createUser(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  })
   
})

const login = catchAsync(async (req: Request, res: Response) => {


  const result = await UserService.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successfully",
    data: result,
  })
  
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.updateUser(id, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.deleteUser(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  })
})
const singleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.getMeUser(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "get me successfully",
    data: result,
  })
})

export const UserController = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  singleUser,
};


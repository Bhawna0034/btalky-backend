import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
  profilePic?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
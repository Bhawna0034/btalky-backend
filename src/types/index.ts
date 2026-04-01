export interface IUser extends Document {
  _id: string;
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
      user?: IUser; // now req.user is typed
    }
  }
}

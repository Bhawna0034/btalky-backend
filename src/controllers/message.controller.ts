import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { getReceiverSocketId, io } from "../lib/socket";
import { FilterQuery } from "mongoose";


export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const {search} = req.query;
    const loggedInUserId = req.user._id;
    console.log(loggedInUserId);
    const query: FilterQuery<typeof User> = {
      _id: { $ne: loggedInUserId },
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      query.fullName = { $regex: search, $options: "i" };
    }

    const filteredUsers = await User.find(query).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } =  req.params;
    const myId = await req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessage controller", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { id: receiverId } = req.params as {id: string};
  const { text, image } = req.body;
  try {
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteChat = async(req: Request, res: Response) => {
  try {
    const { id: chatId } = req.params;
    const myId = req.user._id;
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: chatId },
        { senderId: chatId, receiverId: myId },
      ],
    });
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
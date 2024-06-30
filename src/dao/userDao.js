import { userModel } from "../models/userModel.js";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export default class UserDao {
  async getAll() {
    return await userModel
      .find({})
      .populate("cart")
      .populate("cart.products.product")
      .lean();
  }

  async create(user) {
    return await userModel.create(user);
  }

  async findByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }

  async update(userId, cartId) {
    return await userModel.findByIdAndUpdate(userId, { cart: cartId });
  }

  async findById(userId) {
    return await userModel.findById(userId).lean();
  }

  async updatePassword(userId, newPassword) {
    return await userModel.findByIdAndUpdate(userId, { password: newPassword });
  }

  async getUserByToken(token) {
    //ask if I should use passport here
    const decoded = jwt.verify(token, secretKey);
    return await userModel.findOne({ email: decoded.email }).lean();
  }
}

import userService from "../services/userService.js";
import UserDTO from "../dao/DTOs/userDto.js";
import ticketRepository from "../repository/ticketRepository.js";

export default class UserController {
  async getUsers() {
    try {
      return await userService.getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  async registerUser(user) {
    const newUser = new UserDTO(user);
    try {
      return await userService.registerUser(newUser);
    } catch (error) {
      console.error(error);
    }
  }

  async loginUser(email, password) {
    try {
      return await userService.loginUser(email, password);
    } catch (error) {
      throw new Error("Login Error!");
    }
  }

  async updateUser(userId, cartId) {
    try {
      return await userService.updateUser(userId, cartId);
    } catch (error) {
      console.error(error);
    }
  }

  async findUserEmail(email) {
    try {
      return await userService.findUserEmail(email);
    } catch (error) {
      console.error(error);
    }
  }

  async createTicket(ticketData) {
    try {
      return await ticketRepository.createTicket(ticketData);
    } catch (error) {
      console.error(error);
      throw new Error("Error creating ticket");
    }
  }
}

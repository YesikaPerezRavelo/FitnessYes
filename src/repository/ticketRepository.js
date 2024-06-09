import ticketDTO from "../dao/DTOs/ticketDto.js";
import TicketDao from "../dao/ticketDao.js";
import { userModel } from "../models/userModel.js";

class TicketRepository {
  constructor() {
    this.ticketDao = new TicketDao();
  }

  async getAllTickets(limit, page, query, sort) {
    try {
      return await this.ticketDao.getAll(limit, page, query, sort);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching tickets from repository");
    }
  }

  async getTicketById(tid) {
    try {
      const result = await this.ticketDao.getById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching ticket from repository");
    }
  }

  async createTicket(ticketData) {
    try {
      const { purchaseDateTime, amount, purchaser } = ticketData;

      // Find the user by email
      const user = await userModel.findOne({ email: purchaser });
      if (!user) {
        throw new Error("Purchaser not found");
      }

      const code = await this.generateTicketCode();
      const newTicketDTO = new ticketDTO({
        code,
        purchaseDateTime,
        amount,
        purchaser: user._id,
      });
      return await this.ticketDao.create(newTicketDTO);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating ticket in repository");
    }
  }

  async generateTicketCode() {
    try {
      const randomCode = Math.floor(Math.random() * 1000) + 1;
      return randomCode;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating random code");
    }
  }
}

export default new TicketRepository();
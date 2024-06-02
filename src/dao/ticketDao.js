import ticketModel from "../models/ticketModel.js";

class TicketDao {
  async getAllTickets(query, options) {
    return await ticketModel.paginate(query, options);
  }

  async getTicketById(ticketId) {
    return await ticketModel.findOne({ _id: ticketId });
  }

  async getTicketsByUserId(userId) {
    return await ticketModel.find({ purchaser: userId });
  }

  async createTicket(ticket) {
    return await ticketModel.create(ticket);
  }
}

const ticketDao = new TicketDao();
export default ticketDao;

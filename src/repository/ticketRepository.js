import TicketModel from "../models/ticketModel.js";

class TicketRepository {
  async getAllTickets() {
    try {
      return await TicketModel.find().lean();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching tickets from database");
    }
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await TicketModel.create(ticketData);
      return newTicket.toObject();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating new ticket");
    }
  }
}

const ticketRepository = new TicketRepository();
export default ticketRepository;

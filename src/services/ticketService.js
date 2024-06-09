import TicketRepository from "../repository/ticketRepository.js";

export default class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async getAllTickets(limit, page, query, sort) {
    const options = { page: page ?? 1, limit: limit ?? 100, sort, lean: true };
    return await this.ticketRepository.getAllTickets(query ?? {}, options);
  }

  async getTicketById(tid) {
    return await this.ticketRepository.getTicketById(tid);
  }

  async getTicketsByUserId(userId) {
    return await this.ticketRepository.getTicketsByUserId(userId);
  }

  async createTicket(ticket) {
    return await this.ticketRepository.createTicket(ticket);
  }

  async generateTicketCode() {
    try {
      return await this.ticketRepository.generateTicketCode();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error generating ticket code");
    }
  }
}

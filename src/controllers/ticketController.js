import ticketService from "../services/ticketService.js";

class TicketController {
  async getAllTickets(req, res) {
    const { limit, page, query, sort } = req.query;
    try {
      const result = await ticketService.getAllTickets(
        limit,
        page,
        query,
        sort
      );
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching tickets" });
    }
  }

  async getTicketById(req, res) {
    const { tid } = req.params;
    try {
      const result = await ticketService.getTicketById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createTicket(req, res) {
    try {
      const result = await ticketService.createTicket(req.body);
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.error(error.message);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
}

export default TicketController;

import { Router } from "express";
import TicketController from "../controllers/ticketController.js";

const router = Router();
const ticketController = new TicketController();

router.get("/", (req, res) => ticketController.getAllTickets(req, res));
router.get("/:tid", (req, res) => ticketController.getTicketById(req, res));
router.post("/", (req, res) => ticketController.createTicket(req, res));

export default router;

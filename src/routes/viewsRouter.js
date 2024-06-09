import { Router } from "express";
import ProductController from "../controllers/productController.js";
import MessageController from "../controllers/messageController.js";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";
import TicketController from "../controllers/ticketController.js"; // Import TicketController
import { authToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

const router = Router();
const productController = new ProductController();
const cartController = new CartController();
const messageController = new MessageController();
const userController = new UserController();
const ticketController = new TicketController(); // Instantiate TicketController

router.get("/", (req, res) => {
  res.render("home", {
    title: "YesFitness | Home",
    style: "index.css",
  });
});

router.get("/login", async (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  } else {
    res.render("login", {
      title: "YesFitness | Login",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  }
});

router.get("/register", (req, res) => {
  if (req.cookies.auth) {
    res.redirect("/user");
  }
  res.render("register", {
    title: "YesFitness | Register",
    style: "index.css",
    failRegister: req.session.failRegister ?? false,
  });
});

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.render("user", {
        title: "YesFitness | Usuario",
        style: "index.css",
        user: req.user.user,
        cart: [],
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  auth("student"),
  async (req, res) => {
    let { limit = 5, page = 1 } = req.query;
    try {
      res.render("products", {
        title: "Productos",
        style: "index.css",
        user: await userController.findUserById(req.user.user._id),
        products: await productController.getAllProducts(limit, page),
      });
    } catch (error) {
      res.status(403).send({
        status: "error",
        message: "Forbidden",
      });
    }
  }
);

router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  auth("teacher"),
  async (req, res) => {
    try {
      const products = await productController.getAllProducts();
      res.render("realTimeProducts", {
        title: "Productos",
        style: "index.css",
        products,
      });
    } catch (error) {
      res.status(403).send({
        status: "error",
        message: "Forbidden",
      });
    }
  }
);

router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  auth("student"),
  async (req, res) => {
    try {
      const messages = await messageController.getAllMessages();
      res.render("messageService", {
        title: "Chat",
        style: "index.css",
        messages: messages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/cart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let cartId = req.query.cid;
    try {
      if (!cartId) {
        const newCart = await cartController.createCart();
        cartId = newCart._id;
        return res.redirect(`/cart?cid=${cartId}`);
      }
      const cart = await cartController.getProductsFromCartByID(cartId);
      res.render("cart", {
        title: "YesFitness Cart",
        style: "index.css",
        cartId: cartId,
        products: cart.products || [],
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      res.redirect("/error");
    }
  }
);

router.get("/unauthorized", (req, res) => {
  res.status(401).render("unauthorized", {
    title: "Unauthorized",
    style: "index.css",
  });
});

// Add the route for viewing the ticket
router.get(
  "/ticket/:tid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const ticket = await ticketController.getTicketById(req, res);
      res.render("ticket", {
        title: "Ticket Details",
        style: "index.css",
        ticket: ticket.payload,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;

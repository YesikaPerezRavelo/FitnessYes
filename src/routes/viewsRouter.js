import { Router } from "express";
import ProductController from "../controllers/productController.js";
import MessageController from "../controllers/messageController.js";
import CartController from "../repository/cartRepository.js";
import UserController from "../controllers/userController.js";
import { authToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

const router = Router();
const productController = new ProductController();
const cartControllerDB = new CartController();
const messageController = new MessageController();
const userController = new UserController();

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
    console.log(await userController.findUserById(req.user.user._id));
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
    const cartId = req.query.cid;
    try {
      const cart = await cartControllerDB.getProductsFromCartByID(cartId);
      res.render("cart", {
        title: "YesFitness Cart",
        style: "index.css",
        cartId: cartId,
        products: cart.products,
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

export default router;

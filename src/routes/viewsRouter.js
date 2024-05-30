import { Router } from "express";
import productController from "../controllers/productController.js";
import messageController from "../controllers/messageController.js";
import cartController from "../controllers/cartController.js";
import { authToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

const router = Router();
const productControllerDB = new productController();
const cartControllerDB = new cartController();

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

router.get("/products", async (req, res) => {
  let { limit = 5, page = 1 } = req.query;

  res.render("products", {
    title: "Productos",
    style: "index.css",
    products: await productControllerDB.getAllProducts(limit, page),
  });
});

router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  auth("teacher"),
  async (req, res) => {
    try {
      const products = await productControllerDB.getAllProducts();
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

router.get("/chat", async (req, res) => {
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
});

router.get("/cart", authToken, async (req, res) => {
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
});

// Unauthorized route
router.get("/unauthorized", (req, res) => {
  res.status(401).render("unauthorized", {
    title: "Unauthorized",
    style: "index.css",
  });
});

export default router;

import { Router } from "express";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";
import TicketController from "../controllers/ticketController.js";
import passport from "passport";

const router = Router();
const cartController = new CartController();
const userController = new UserController();
const ticketController = new TicketController();

router.get("/:cid", async (req, res) => {
  try {
    const result = await cartController.getProductsFromCartByID(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot get Products from cart");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await cartController.createCart();
    res.send({
      status: "success",
      message: "Your cart has been successfully created",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot add Cart");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;
  try {
    const response = await userController.registerUser(user);
    const cart = await cartController.createCart();
    await userController.updateUser(response._id, { cart: cart._id });
    res.redirect("/user");
  } catch (error) {
    res.redirect("/register");
    req.logger.warning("Cannot register User with CartId");
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartController.getAllCarts();
    res.send({ carts });
  } catch (error) {
    req.logger.warning("Cannot see all Carts made");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  console.log(
    "cartId:",
    cartId,
    "productId:",
    productId,
    "quantity:",
    quantity
  );

  if (!productId || !quantity) {
    console.error("Invalid productId or quantity");
    return res.status(400).send({
      status: "error",
      error: "Invalid productId or quantity",
    });
  }

  try {
    await cartController.addProductToCart(cartId, productId, quantity);
    res.send({
      status: "success",
      message: "Product has been added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error adding the product to the cart",
    });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;
  try {
    const cart = await cartController.updateCart(cartId, products);
    res.send({ status: "success", message: "Your cart has been edited", cart });
  } catch (error) {
    req.logger.warning("Cannot update Cart");
    console.error(error);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  try {
    await cartController.updateProductQuantity(cartId, productId, quantity);
    res.send({ status: "success", message: "Quantity changed" });
  } catch (error) {
    req.logger.warning("Cannot update Quantity");
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error updating the product quantity",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    await cartController.deleteAllProductsFromCart(cartId);
    res.send("Cart has been deleted");
  } catch (error) {
    req.logger.warning("Cannot delete cart");
    console.error(error);
    res
      .status(400)
      .send({ status: "error", error: "There was an error deleting the cart" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    await cartController.deleteProductFromCart(cartId, productId);
    res.send(`Product ${productId} has been deleted from the cart`);
  } catch (error) {
    req.logger.warning("Cannot delete Product from cart");
    console.error(error);
    res.status(400).send({
      status: "error",
      error: "There was an error deleting the product from the cart",
    });
  }
});

// GET /carts/:cid - Fetch details of a specific cart by ID
router.get("/:cid", async (req, res) => {
  try {
    const result = await cartController.getProductsFromCartByID(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    req.logger.warning("Cannot fetch the details");
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// POST /carts/:cid/purchase - Finalize the purchase process for a cart
router.post(
  "/:cid/purchase",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("req.user:", req.user);
      // Step 1: Get purchaser's email (assuming it's stored in req.user.email)
      const purchaser = req.user.email;
      const cartId = req.params.cid;

      // Step 2: Purchase cart and get products that couldn't be processed
      const { processed, notProcessed } = await cartController.purchaseCart(
        cartId
      );

      // Step 3: Calculate total amount from the processed items in cart
      const cart = await cartController.getProductsFromCartByID(cartId);
      let amount = 0;
      for (const cartProduct of cart.products) {
        amount += cartProduct.product.price * cartProduct.quantity;
      }

      // Step 4: Create ticket for the purchase
      const ticket = await ticketController.createTicket(
        purchaser,
        amount,
        processed,
        cartId
      );

      // Step 5: Update cart with products that were not successfully processed
      // await cartController.updateCartWithNotProcessed(cartId, notProcessed);

      // Step 6: Send response
      res.send({
        status: "success",
        payload: {
          ticket,
          notProcessed,
        },
      });

      // res.render("ticket", {
      // title: "Ticket",
      // ticket: ticket,
      // notProcessed: notProcessed
    } catch (error) {
      console.error(error);
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

export default router;

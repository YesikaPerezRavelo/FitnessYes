import chai from "chai";
import mongoose from "mongoose";
import CartDao from "../dao/cartDao.js";
import Cart from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { ObjectId } from "mongodb";

const expect = chai.expect;
const cartDao = new CartDao();

describe("CartDao", function () {
  before(async function () {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Cart.deleteMany({});
    await productModel.deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should create a new cart", async function () {
    const cart = await cartDao.create();
    expect(cart._id).to.exist;
    expect(cart.products).to.be.an("array").that.is.empty;
  });

  it("should add a product to the cart", async function () {
    const product = await productModel.create({
      title: "Test Product",
      description: "Test Description",
      code: "test-code",
      price: 10,
      status: true,
      stock: 100,
      category: "Test Category",
      thumbnails: [],
      owner: "test-owner",
    });

    const cart = await cartDao.create();
    const updatedCart = await cartDao.addCart(cart._id, product._id, 2);

    expect(updatedCart.products).to.have.lengthOf(1);
    expect(updatedCart.products[0].product.toString()).to.equal(
      product._id.toString()
    );
    expect(updatedCart.products[0].quantity).to.equal(2);
  });

  it("should update product quantity in the cart", async function () {
    const product = await productModel.create({
      title: "Another Test Product",
      description: "Another Test Description",
      code: "another-test-code",
      price: 20,
      status: true,
      stock: 50,
      category: "Another Test Category",
      thumbnails: [],
      owner: "another-test-owner",
    });

    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.updateQuantity(cart._id, product._id, 5);

    const updatedProduct = updatedCart.products.find(
      (p) => p.product.toString() === product._id.toString()
    );

    expect(updatedProduct.quantity).to.equal(5);
  });

  it("should delete a product from the cart", async function () {
    const product = await productModel.create({
      title: "Yet Another Test Product",
      description: "Yet Another Test Description",
      code: "yet-another-test-code",
      price: 15,
      status: true,
      stock: 70,
      category: "Yet Another Test Category",
      thumbnails: [],
      owner: "yet-another-test-owner",
    });

    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.deleteProduct(cart._id, product._id);

    expect(updatedCart.products).to.have.lengthOf(0);
  });

  it("should get cart by ID", async function () {
    const product = await productModel.create({
      title: "Final Test Product",
      description: "Final Test Description",
      code: "final-test-code",
      price: 30,
      status: true,
      stock: 60,
      category: "Final Test Category",
      thumbnails: [],
      owner: "final-test-owner",
    });

    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const foundCart = await cartDao.getById(cart._id);

    expect(foundCart._id.toString()).to.equal(cart._id.toString());
  });

  it("should delete all products from the cart", async function () {
    const product = await productModel.create({
      title: "Another Final Test Product",
      description: "Another Final Test Description",
      code: "another-final-test-code",
      price: 40,
      status: true,
      stock: 80,
      category: "Another Final Test Category",
      thumbnails: [],
      owner: "another-final-test-owner",
    });

    const cart = await cartDao.create();
    await cartDao.addCart(cart._id, product._id, 2);
    const updatedCart = await cartDao.deleteProducts(cart._id);

    expect(updatedCart.products).to.have.lengthOf(0);
  });
});

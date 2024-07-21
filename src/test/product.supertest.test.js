import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { fakerES_MX } from "@faker-js/faker";
import { startLogger } from "../utils/loggerUtil.js";
import * as dotenv from "dotenv";
import path from "path";
//mocha src/test/product.supertest.test.js

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const isTeacher = {
  email: "admin@fitness.com",
  password: "admin12345",
};

export const generateProducts = () => ({
  id: fakerES_MX.string.uuid(),
  title: fakerES_MX.commerce.productName(),
  description: fakerES_MX.commerce.productDescription(),
  code: fakerES_MX.string.alphanumeric(6),
  price: fakerES_MX.commerce.price(),
  status: fakerES_MX.datatype.boolean(0.5),
  stock: fakerES_MX.number.int(100),
  category: fakerES_MX.commerce.productAdjective(),
  thumbnail: fakerES_MX.image.url({ height: 100, width: 100 }),
});

let authToken;

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger(`DB connection successful`);
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
  }
});

describe("Testing login endpoint", () => {
  it("Login credentials", async () => {
    const response = await requester
      .post("/api/users/login")
      .send(isTeacher)
      .set("Accept", "application/json");

    if (response.statusCode === 302) {
      const location = response.headers.location;
      const followUpResponse = await requester.get(location);

      expect(followUpResponse.statusCode).to.equal(200);
      authToken = followUpResponse.body.token;
    } else {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property("token");
      authToken = response.body.token;
    }

    console.log("Auth Token:", authToken);
  });
});

it("PUT Operation for Products Endpoint", async () => {
  const updatedProduct = { title: "New Title" };
  const response = await requester
    .put("/api/products/661c83aa9905cc901b886f54")
    .send(updatedProduct)
    .set("Accept", "application/json")
    .set("Authorization", `Bearer ${authToken}`);

  expect(response.status).to.equal(200);
});

after(async () => {
  await mongoose.disconnect();
  startLogger("DB disconnected");
});

// import { expect } from "chai";
// import supertest from "supertest";
// import jwt from "jsonwebtoken";
// import * as dotenv from "dotenv";
// import mongoose from "mongoose";
// import ProductDTO from "../dao/DTOs/productDto.js";

// // Load environment variables
// dotenv.config();

// // Set up Supertest and test data
// const uri = process.env.URI;
// const SECRET_KEY = process.env.SECRET_KEY;
// const requester = supertest("http://localhost:8080");

// const testProduct = {
//   title: "TestProduct",
//   description: "TestDescription",
//   code: "12345",
//   price: 1000,
//   stock: 100,
//   category: "ABC",
// };

// // Connect to the test database
// mongoose.connect(uri, {
//   dbName: "testingSuperTest",
// });

// // Define a test user
// const user = {
//   _id: "test_user_id", // Use a valid test user ID
//   owner: "teacher",
// };

// // Generate a JWT token for the test user
// const token = jwt.sign({ _id: user._id, owner: user.user.owner }, SECRET_KEY, {
//   expiresIn: "1h",
// });

// describe("Test Products", function () {
//   // Increase the timeout if necessary
//   this.timeout(5000);

//   // Clean up before each test
//   before(async function () {
//     try {
//       const productCollection = mongoose.connection.db.collection("products");
//       await productCollection.deleteMany({}); // Drop all documents in the collection
//     } catch (error) {
//       console.log("No collection to drop or other error:", error);
//     }
//   });

//   // Test case for creating a product
//   it("POST /api/products should create a product successfully", async function () {
//     const response = await requester
//       .post("/api/products")
//       .set("Cookie", [`auth=${token}`]) // Use the JWT token for authorization
//       .send(testProduct);

//     // Assert the response
//     expect(response.status).to.equal(200);
//     expect(response.body.status).to.equal("success");

//     // Fetch the created product from the database and verify its owner
//     const product = await mongoose.connection.db
//       .collection("products")
//       .findOne({ code: testProduct.code });
//     expect(product).to.not.be.null;
//     const productDto = new ProductDTO(product);
//     expect(productDto.owner).to.equal(user.user.owner);
//   });
// });

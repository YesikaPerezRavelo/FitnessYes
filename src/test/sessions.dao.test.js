import Assert from "assert";
import mongoose from "mongoose";
import UserDao from "../dao/userDao";
import * as dotenv from "dotenv";
dotenv.config();

const uri = process.env.URI;

mongoose.connect(uri, { dbName: testing });
const dao = new UserDao();
const assert = Assert.strict;

//This groups all the related test togehter
describe("Tests DAO Users", function () {
  //Runs once befoe all test start. Use it to set up anything needed for all test.
  before(function () {});

  //Runs before each individual test. Use it to reset things so each test starts fresh.
  beforeEach(function () {});

  //Runs one after all test finish. Use it to clean up things set up in before.
  after(function () {});

  //Runs after each individual test. Use it to clean up after each test.
  afterEach(function () {});

  //This is a single test.
  it("getAll() shoulde return all users", async function () {});
});

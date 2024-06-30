import { Router } from "express";
import userController from "../controllers/userController.js";
import ProductController from "../controllers/productController.js";
import { generateToken, authToken } from "../utils/utils.js";
import passport from "passport";

const router = Router();

const productControllerDB = new ProductController();
const userControllerDB = new userController();

router.get("/users", async (req, res) => {
  try {
    const result = await userControllerDB.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    req.session.failLogin = false;
    const user = await userControllerDB.findUserEmail(email);
    if (!user || password !== user.password) {
      req.session.failLogin = true;
      console.log("contraseña incorrecta");
      return res.redirect("/login");
    }
    req.session.user = user;
    const access_token = generateToken(user);
    res.cookie("access_token", access_token).json("success", access_token);
    // res.redirect("/user");
  } catch (error) {
    console.error("Error during login:", error);
    req.session.failLogin = true;
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.clearCookie("access_token");
    res.redirect("/login");
  });
});

const filterUserData = (user) => {
  const { _id, password, role, __v, ...filteredUser } = user;
  return filteredUser;
};

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const filteredUser = filterUserData(req.user.user);
    res.send({
      status: "success",
      user: filteredUser,
    });
  }
);

// Route to switch user role (teacher)
router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await userControllerDB.findUserById(req.params.uid);
      const roles = ["student", "teacher"];

      if (req.user.user.role !== "teacher") {
        return res.status(401).json({
          error: "Unauthorized",
          message: "You do not have permission to access this page.",
        });
      }

      res.render("switchRoleView", {
        title: "Role Switcher",
        user: user,
        role: roles,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Update user role (teacher)
router.put(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const uid = req.params.uid;
    const newRole = req.body.role;

    try {
      if (req.user.user.role !== "teacher") {
        return res.status(401).json({
          error: "Unauthorized",
          message: "You do not have permission to update roles.",
        });
      }

      await userControllerDB.updateRole(uid, newRole);
      res.status(200).send("Role updated successfully!");
    } catch (error) {
      res.status(500).send("Error updating role!");
    }
  }
);

export default router;

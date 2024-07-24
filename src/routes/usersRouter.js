import { Router } from "express";
import userController from "../controllers/userController.js";
import { generateToken } from "../utils/utils.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";
import { uploader } from "../utils/multerUtil.js";

const router = Router();
const userControllerDB = new userController();

router.get("/", async (req, res) => {
  try {
    const result = await userControllerDB.getUsers();
    res.send({ users: result });
  } catch (error) {
    console.error(error);
  }
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

router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  auth(["student", "premium"]),
  async (req, res) => {
    try {
      const user = await userControllerDB.findUserById(req.params.uid);
      const roles = ["student", "premium"];

      if (
        req.user.user.role !== "student" &&
        req.user.user.role !== "premium"
      ) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "You do not have permission to access this page.",
        });
      }

      res.render("switchRole", {
        title: "Role Switcher",
        style: "index.css",
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

router.put(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;

      const user = await userControllerDB.findUserById(uid);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the user wants to upgrade to premium
      if (role === "premium") {
        const requiredDocs = [
          "Identification",
          "proof of address",
          "proof_of_account_status",
        ];
        const uploadedDocs = user.documents || [];

        const hasAllDocs = requiredDocs.every((doc) =>
          uploadedDocs.some((uploadedDoc) => uploadedDoc.includes(doc))
        );

        if (!hasAllDocs) {
          return res.status(400).json({
            error: "Incomplete documentation",
            message:
              "User has not finished processing the required documentation.",
          });
        }
      }

      console.log(`Updating role for user ${uid} to ${role}`);
      const updatedUser = await userControllerDB.updateRole(uid, role);

      const newToken = generateToken(updatedUser);
      res.cookie("access_token", newToken);

      res
        .status(200)
        .json({ success: true, user: updatedUser, token: newToken });
    } catch (error) {
      console.error(`Error updating role: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:uid/documents/",
  passport.authenticate("jwt", { session: false }),
  uploader.array("documents"),
  async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await userControllerDB.findUserById(userId);

      if (!user) return res.status(404).json({ error: "User not found" });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No documents provided" });
      }

      const uploadedFiles = req.files.map((file) => file.filename);

      user.documents = [...(user.documents || []), ...uploadedFiles];
      user.hasUploadedDocuments = true;

      await user.save();

      return res.status(200).json({ message: "Documents have been uploaded" });
    } catch (error) {
      console.error("Error uploading documents:", error);
      return res.status(500).json({ error: "Error uploading documents" });
    }
  }
);

export default router;

// import { Router } from "express";
// import userController from "../controllers/userController.js";
// import { generateToken } from "../utils/utils.js";
// import passport from "passport";
// import { auth } from "../middlewares/auth.js";

// const router = Router();

// const userControllerDB = new userController();

// router.get("/", async (req, res) => {
//   try {
//     const result = await userControllerDB.getUsers();
//     res.send({ users: result });
//   } catch (error) {
//     console.error(error);
//   }
// });

// const filterUserData = (user) => {
//   const { _id, password, role, __v, ...filteredUser } = user;
//   return filteredUser;
// };

// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const filteredUser = filterUserData(req.user.user);
//     res.send({
//       status: "success",
//       user: filteredUser,
//     });
//   }
// );

// // Route to switch user role (only student) Only to student to premium and vice versa
// router.get(
//   "/premium/:uid",
//   passport.authenticate("jwt", { session: false }),
//   auth(["student", "premium"]),
//   async (req, res) => {
//     try {
//       const user = await userControllerDB.findUserById(req.params.uid);
//       const roles = ["student", "premium"];

//       // allow "student" or "premium" change roles
//       if (
//         req.user.user.role !== "student" &&
//         req.user.user.role !== "premium"
//       ) {
//         return res.status(401).json({
//           error: "Unauthorized",
//           message: "You do not have permission to access this page.",
//         });
//       }

//       res.render("switchRole", {
//         title: "Role Switcher",
//         style: "index.css",
//         user: user,
//         role: roles,
//       });
//     } catch (error) {
//       res.status(400).send({
//         status: "error",
//         message: error.message,
//       });
//     }
//   }
// );

// router.put(
//   "/premium/:uid",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     try {
//       const { uid } = req.params;
//       const { role } = req.body;
//       console.log(`Updating role for user ${uid} to ${role}`);
//       const updatedUser = await userControllerDB.updateRole(uid, role);

//       // new token
//       const newToken = generateToken(updatedUser);
//       res.cookie("access_token", newToken);

//       res
//         .status(200)
//         .json({ success: true, user: updatedUser, token: newToken });
//     } catch (error) {
//       console.error(`Error updating role: ${error.message}`);
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// export default router;

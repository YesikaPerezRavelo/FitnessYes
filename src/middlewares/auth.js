export const auth = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return next();
};

// export const auth = function (req, res, next) {
//   const { user, password } = req.body;

//   if (user === "admin@fitness.com" && password === "admin12345") {
//       req.session.user = user;
//       req.session.admin = true;
//       const adminUser = {
//           user: "admin@fitness.com",
//           role: "admin12345"
//       }

//       req.session.user = adminUser;
//       return res.redirect("/products");
//   } else {
//       return next();
//   }
// }

export default {
  isAdmin: function (user) {
    return user && user.role === "teacher";
  },
  isPremium: function (user) {
    return user && user.role === "premium"; //role of both student and teacher"
  },
  or: function (a, b) {
    return a || b;
  },
  and: function (a, b) {
    return a && b;
  },
  eq: function (a, b) {
    return a === b;
  },
  not: function (value) {
    return !value;
  },
};

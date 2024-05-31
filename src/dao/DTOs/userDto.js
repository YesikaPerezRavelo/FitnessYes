export default class UserDTO {
  constructor(user) {
    this.email = user.email;
    this.id = user._id;
    this.firtName = user.first_name;
    this.lastName = user.last_Name;
    this.role = user.role;
    this.cartId = user.cartId;
    this.login = true;
    this.fullName = `${user.first_name} ${user.last_name}`;
  }
}

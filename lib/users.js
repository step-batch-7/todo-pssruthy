class Users {
  constructor() {
    this.users = {};
  }

  static load(usersDetails) {
    const userHistory = JSON.parse(usersDetails || '{}');
    const users = new Users();
    users.users = userHistory;
    return users;
  }

  addNewUser(details) {
    const {
      newUsrName: userId,
      newEmail: email,
      newPassword: password
    } = details;
    this.users[userId] = { userId, email, password };
  }

  toJSON() {
    return JSON.stringify(this.users, null, 2);
  }

  isUsrExist(usrId) {
    return usrId in this.users;
  }

  validate(userName, password) {
    if (userName in this.users) {
      return this.users[userName].password === password;
    }
    return false;
  }
}

module.exports = { Users };

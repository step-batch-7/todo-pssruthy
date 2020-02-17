const assert = require('chai').assert;

const { Users } = require('./../lib/users');

describe('* class Users', function() {
  const sampleUsers = {
    sru: { userId: 'sru', email: 'sru@gmail.com', password: 'password' }
  };

  describe('load', function() {
    it('Should give users with proper instance when the user details are empty', function() {
      const users = Users.load('{}');
      assert.ok(users instanceof Users);
    });

    it('Should give users with proper instance when the user details are present', function() {
      const users = Users.load(JSON.stringify(sampleUsers));
      assert.ok(users instanceof Users);
      assert.deepStrictEqual(users.users, sampleUsers);
    });
  });

  describe('addNewUser', function() {
    it('Should add new user in the users list', function() {
      const sampleUserDetails = {
        newUsrName: 'sru',
        newEmail: 'sru@gmail.com',
        newPassword: 'password'
      };
      const users = new Users();
      users.addNewUser(sampleUserDetails);
      assert.deepStrictEqual(users.users, sampleUsers);
    });
  });

  describe('isUsrExist', () => {
    it('Should give true when the user is already present', () => {
      const users = Users.load(JSON.stringify(sampleUsers));
      assert.isTrue(users.isUsrExist('sru'));
    });
    it('Should give false when the user is not present', () => {});
    const users = Users.load(JSON.stringify(sampleUsers));
    assert.isFalse(users.isUsrExist('sruthy'));
  });

  describe('validate', () => {
    it('Should give true when the user id and password are valid', () => {
      const users = Users.load(JSON.stringify(sampleUsers));
      assert.isTrue(users.validate('sru', 'password'));
    });
    it('Should give false when the user id and password are not valid', () => {});
    const users = Users.load(JSON.stringify(sampleUsers));
    assert.isFalse(users.validate('sruthy', 'sru'));
  });
});

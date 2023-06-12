'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Minh',
      lastName: 'PK',
      address: 'USA',
      phonenumber: '0374544626',
      gender: 1,
      image: 'facebook.com/pkm0501',
      roleId: 'R1',
      positionId: 'DOCTOR',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

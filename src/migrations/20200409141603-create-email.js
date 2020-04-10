'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Emails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uid: {
                allowNull: false,
                type: Sequelize.STRING(50)
            },
            to: {
                allowNull: false,
                type: Sequelize.STRING(200)
            },
            subject: {
                allowNull: false,
                type: Sequelize.STRING(200)
            },
            content: {
                allowNull: false,
                type: Sequelize.STRING(5000)
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING(50)
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Emails');
    }
};
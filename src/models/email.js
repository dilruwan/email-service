module.exports = (sequelize, DataTypes) => {
    const Email = sequelize.define('Email', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uid: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        to: {
            allowNull: false,
            type: DataTypes.STRING(200)
        },
        subject: {
            allowNull: false,
            type: DataTypes.STRING(200)
        },
        content: {
            allowNull: false,
            type: DataTypes.STRING(5000)
        },
        status: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
    }, {});
    Email.associate = function(models) {
        // associations can be defined here
    };

    return Email;
};
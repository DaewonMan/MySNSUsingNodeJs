module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
      wm_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      wm_pw: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      wm_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      wm_birth: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      wm_add1: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      wm_add2: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      wm_add3: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      wm_img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      wm_open: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        defaultValue: 1,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
  );
module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
      wp_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wp_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wp_hash: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      wp_img: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      wp_likenum: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
  );
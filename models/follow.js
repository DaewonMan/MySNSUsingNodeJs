module.exports = (sequelize, DataTypes) => (
    sequelize.define('follow', {
      wf_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wf_follower: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
);
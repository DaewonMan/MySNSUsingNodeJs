/*
wlb_no number(10) primary key,
wlb_id varchar2(10 char) not null,
wlb_bool number(2) not null,
wlb_pno number(10) not null
*/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('likebool', {
      wlb_id: { // 좋아요 한 사람
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wlb_bool: { // 좋아요 여부
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      wlb_pno: { // 좋아요한 게시물
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
);
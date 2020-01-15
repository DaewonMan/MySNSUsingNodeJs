/*
    wr_no number(10) primary key,
	wr_id varchar2(10 char) not null,
	wr_rno number(10) not null,
	wr_reple varchar2(200 char) not null
*/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('reple', {
      wr_id: { // 댓글 남긴 사람
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      wr_pno: { // 댓글 남긴 게시물 번호
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      wr_reple: { // 댓글 내용
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    }, {
      timestamps: true,
      paranoid: true,
    })
);
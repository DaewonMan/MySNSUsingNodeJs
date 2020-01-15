const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

/* 사용자 정보 객체를 세션에 아이디로 저장 */
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.wm_id);
  });

  /* 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것 */
  passport.deserializeUser((wm_id, done) => {
    User.findOne({ where: { wm_id }})
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  /*
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  */
  local(passport);
  kakao(passport);
};
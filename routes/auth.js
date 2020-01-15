const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

/* id 중복 체크 */
router.get('/idCheck', isNotLoggedIn, async (req, res, next) => {
  const wm_id = req.query.wm_id;
  const exUser = await User.findOne({ where: { wm_id } });

  var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
  xmlResult += '<members>';
  if (exUser) {
    xmlResult += '<member>exist</member>';
  }
  xmlResult += '</members>';

  return res.json(xmlResult);
});

/* 회원가입할 수 있게 디비에 삽입 */
const upload = multer();
router.post('/join', isNotLoggedIn, upload.none(), async (req, res, next) => {
  //const { wm_id, wm_pw, wm_name, wm_y, wm_m, wm_d, wm_add1, wm_add2, wm_add3 } = req.body;
  //const { wm_img } = req.files;
  try {
    /*
    const exUser = await User.findOne({ where: { wm_id } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    */
    const hash = await bcrypt.hash(req.body.wm_pw, 12);
    var birthDay = req.body.wm_y + '-' + req.body.wm_m + '-' + req.body.wm_d;
    await User.create({
      wm_id: req.body.wm_id,
      wm_pw: hash,
      wm_name: req.body.wm_name,
      wm_birth: birthDay,
      wm_add1: req.body.wm_add1,
      wm_add2: req.body.wm_add2,
      wm_add3: req.body.wm_add3,
      wm_img: req.body.url,
    });
    req.flash('joinSuccess', '회원가입이 완료되었습니다.');
    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/login');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User, Post, Sequelize, Follow } = require('../models');
const Op = Sequelize.Op;

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    await user.addFollowing(parseInt(req.params.id, 10));
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 파도타기 */
// parameter : wm_id, wave_id
router.get('/wave', async (req, res, next) => {
  //console.log(req.user);
  if(req.user) {
      var waveUser = req.user;
      var wm_id = req.query.wave_id;
      var wp_id = req.user.wm_id;
      var posts;
      if(wm_id != null) {
          wp_id = req.query.wave_id; // 파도탄 인원의 아이디로 변경
          waveUser = await User.findOne({ where: { wm_id } }); // 파도탄 인원 정보
      }
      posts = await Post.findAll({ where: { wp_id } });
      
      res.render('contentArea', {
          title: 'MySnsProject',
          twits: [],
          user: req.user,
          waveUser: waveUser,
          post: posts,
          loginError: req.flash('loginError'),
      });
  } else {
      return res.redirect('/login');
  }
  
});

/* /user/id/search */
/* 회원검색 */
router.get('/id/search', isLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findAll({ where: { wm_id: { [Op.like]: "%" + req.query.wm_id + "%" } } });

    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<members>';
    for (var i = 0;i < exUser.length;i++) {
        xmlResult += '<member><wm_id>' + exUser[i].wm_id + '</wm_id>';
        xmlResult += '<wm_name>' + exUser[i].wm_name + '</wm_name>';
        xmlResult += '<wm_img>' + exUser[i].wm_img + '</wm_img></member>';
    }
    xmlResult += '</members>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* /user/open/update */
/* 공개여부 수정 */
router.get('/open/update', isLoggedIn, async (req, res, next) => {
  try {
    const ok = await User.update({wm_open: req.query.wm_open}, {where: { wm_id: req.query.wm_id}});

    if(ok) 
      return res.json("OK");
    else
      return res.json("FAIL");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 팔로워수 세기 */
router.get('/follower/cnt', isLoggedIn, async (req, res, next) => {
  try {
    const follower = await Follow.findAll({ where: { wf_id: req.query.wf_id } });
    var exUser;
    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<follows>';
    for (var i = 0;i < follower.length;i++) {
        exUser = await User.findOne({ where: { wm_id: follower[i].wf_follower }});
        xmlResult += '<follow><wm_id>' + exUser.wm_id + '</wm_id>';
        xmlResult += '<wm_name>' + exUser.wm_name + '</wm_name>';
        xmlResult += '<wm_img>' + exUser.wm_img + '</wm_img></follow>';
    }
    xmlResult += '</follows>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 팔로잉 세기 */
router.get('/following/cnt', isLoggedIn, async (req, res, next) => {
  try {
    const following = await Follow.findAll({ where: { wf_follower: req.query.wf_follower } });
    var exUser;
    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<follows>';
    for (var i = 0;i < following.length;i++) {
        exUser = await User.findOne({ where: { wm_id: following[i].wf_id }});
        xmlResult += '<follow><wm_id>' + exUser.wm_id + '</wm_id>';
        xmlResult += '<wm_name>' + exUser.wm_name + '</wm_name>';
        xmlResult += '<wm_img>' + exUser.wm_img + '</wm_img></follow>';
    }
    xmlResult += '</follows>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/*/user/insert/follower*/
/* 팔로잉 */
router.post('/insert/follower', isLoggedIn, async (req, res, next) => {
  try {
    const ok = await Follow.create({
      wf_id: req.body.wf_id,
      wf_follower: req.body.wf_follower,
    });

    if(ok) 
      return res.json("OK");
    else
      return res.json("FAIL");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* /user/delete/follower */
/* 언팔 */
router.get('/delete/follower', isLoggedIn, async (req, res, next) => {
  try {
    const ok = await Follow.destroy({ where: {
      wf_id: req.query.wf_id,
      wf_follower: req.query.wf_follower,
    }});

    if(ok) 
      return res.json("OK");
    else
      return res.json("FAIL");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* /user/follow/ornot */
/* 팔로우 여부 */
router.get('/follow/ornot', isLoggedIn, async (req, res, next) => {
  try {
    const following = await Follow.findAll({ where: { wf_id: req.query.wf_id, wf_follower: req.query.wf_follower } });
    var exUser;
    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<follows>';
    for (var i = 0;i < following.length;i++) {
        exUser = await User.findOne({ where: { wm_id: following[i].wf_id }});
        xmlResult += '<follow><wm_id>' + exUser.wm_id + '</wm_id>';
        xmlResult += '<wm_name>' + exUser.wm_name + '</wm_name>';
        xmlResult += '<wm_img>' + exUser.wm_img + '</wm_img></follow>';
    }
    xmlResult += '</follows>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
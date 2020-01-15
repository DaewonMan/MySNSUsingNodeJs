const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User, Reple, Likebool } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

/* 이미지 업로드할 uploads폴더 없을 때, 생성 */
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

/* Multer 모듈 옵션 설정, 파일저장방식, 경로, 파일명 설정 */
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  router.post('/img', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where: { title: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// /post/go
router.get('/go', async (req, res) => {
  if(req.user) {
    var wp_id = req.user.wm_id;
    var posts;
    
    posts = await Post.findAll({ where: { wp_id } });
    res.render('post', {
      title: 'MySnsProject',
      twits: [],
      user: req.user,
      waveUser: req.user,
      post: posts,
      testError: req.flash('testError'),
    });
  } else {
    return res.redirect('/login');
  }
});

/* 게시물을 디비에 삽입 */
const upload3 = multer();
router.post('/do', isLoggedIn, upload3.none(), async (req, res, next) => {
  try {
    await Post.create({
      wp_id: req.user.wm_id,
      wp_title: req.body.wp_title,
      wp_hash: req.body.wp_hash,
      wp_img: req.body.url,
      wp_likenum: "0",
    });
    req.flash('postSuccess', '게시물이 등록 되었습니다.');
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 게시물 보기 */
router.get('/show', async (req, res, next) => {
  //console.log(req.user);
  if(req.user) {
      var waveUser = req.user;
      var wm_id = req.query.wave_id;
      var wp_id = req.user.wm_id;
      var posts;
      var postDetail;
      var reple;
      var id = req.query.id;
      if(wm_id != null) {
          wp_id = req.query.wave_id; // 파도탄 인원의 아이디로 변경
          waveUser = await User.findOne({ where: { wm_id } }); // 파도탄 인원 정보
      }
      posts = await Post.findAll({ where: { wp_id } });
      postDetail = await Post.findOne({ where: { id }});
      reple = await Reple.findAll( { where: { wr_pno: postDetail.id }});
      res.render('postDetail', {
          title: 'MySnsProject',
          twits: [],
          user: req.user,
          waveUser: waveUser,
          post: posts,
          postDetail: postDetail,
          reple: reple,
          loginError: req.flash('postDetailError'),
      });
  } else {
      return res.redirect('/login');
  }
  
});

/* 댓글 달기 */
router.get('/reple/do', isLoggedIn, async (req, res, next) => {
  try {
    await Reple.create({
      wr_id: req.query.wr_id,
      wr_pno: req.query.wr_pno,
      wr_reple: req.query.wr_reple,
    });
    
    const exReple = await Reple.findAll({ where: { wr_pno: req.query.wr_pno } });

    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<reples>';
    for (var i = 0;i < exReple.length;i++) {
      xmlResult += '<reple><wr_id>' + exReple[i].wr_id + '</wr_id>';
      xmlResult += '<wr_pno>' + exReple[i].wr_pno + '</wr_pno>';
      xmlResult += '<wr_reple>' + exReple[i].wr_reple + '</wr_reple></reple>';
    }
    xmlResult += '</reples>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 댓글 갯수 */
router.get('/reple/count', isLoggedIn, async (req, res, next) => {
  try {
    const exReple = await Reple.findAll({ where: { wr_pno: req.query.wr_pno } });

    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<reples>';
    for (var i = 0;i < exReple.length;i++) {
      xmlResult += '<reple>exist</reple>';
    }
    xmlResult += '</reples>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 좋아요 갯수 */
router.get('/like/count', isLoggedIn, async (req, res, next) => {
  try {
    const exLikebool = await Likebool.findAll({ where: { wlb_pno: req.query.wlb_pno } });

    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<likes>';
    for (var i = 0;i < exLikebool.length;i++) {
      if (exLikebool[i].wlb_bool == 1) {
        console.log(exLikebool[i].wlb_bool + "fdsfsdf");
        xmlResult += '<like>exist</like>';
      }
    }
    xmlResult += '</likes>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/*
wlb_no: pno,
wlb_bool: likeCnt,
wlb_id: id
*/
/* 좋아요 업데이트 */
router.get('/like/update', isLoggedIn, async (req, res, next) => {
  try {
    var likeCnt = req.query.wlb_bool;
    var id = req.query.wlb_id;
    var pno = req.query.wlb_pno;
    var realLikeBool = 0;

    const exLikebool = await Likebool.findOne({ where: { wlb_id: id, wlb_pno: pno } });

    if (!exLikebool) {
      await Likebool.create({
        wlb_id: id,
        wlb_pno: pno,
        wlb_bool: likeCnt,
      });
    } else if(likeCnt == 0){
      realLikeBool = exLikebool.wlb_bool;
    } else {
      await Likebool.update({wlb_bool: likeCnt}, {where: { wlb_id: id, wlb_pno: pno }});
      realLikeBool = likeCnt;
    }

    var xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' ;
    xmlResult += '<likes>';
    xmlResult += '<like><wlb_bool>' + realLikeBool + '</wlb_bool></like>';
    xmlResult += '</likes>';

    return res.json(xmlResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
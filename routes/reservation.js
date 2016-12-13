var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User'),
    Reservation = require('../models/Reservation');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

function validateForm(form, options) {
  var check_in = form.check_in || "";
  var check_out = form.check_out || "";
  var human = form.human || "";

  if (!check_in) {
    return 'Check_in날짜를 선택해 주세요.';
  }

  if (!check_out){
    return 'Check_out날짜를 선택해 주세요.';
  }
  
  if(!human) {
    return '인원수를 선택해 주세요.';
  }
  return null;
}

/* GET users listing. */
router.get('/', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
  });
  Post.find({}, function(err, posts, users) {
    if (err) {
      return next(err);
    }
    res.render('reservations/index', {users: users, posts:posts});
    });
});

router.get('/:id', needAuth, function(req, res, next) {
  var id = req.params.id;

  Reservation.findOne(function(err, reservation) {
    if (err) {
      return next(err);
    }
    res.render('reservations/show', {reservation:reservation});
    });
});

router.get('/new/:id', needAuth, function(req, res, next) {
  var post_id = req.params.id;
  
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
  });
  Post.findOne({_id: post_id}, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('reservations/new', {post:post});
    });
});

router.post('/:id', needAuth, function(req, res, next) {
  var post_id = req.params.id;

  var err = validateForm(req.body);
  if(err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  // String으로 넘어오는 날짜를 Date형식으로 변환해줌
  var check_in = new Date(req.body.check_in);
  var check_out = new Date(req.body.check_out);

  var reservation = new Reservation({
   check_in : check_in,
   check_out : check_out,
   human : req.body.human,
   user_id : req.user._id,
   post_id : post_id
  });
  
  reservation.save(function(err){
    if(err) {
      return next(err);
    } else {
      // 요청의 경로를 posts로 재 지정해줌
      res.redirect('/posts');
    }
  });
});

router.delete('/:id', function(req, res, next) {
   Reservation.findById(req.params.id,function(err,reservation){
    if (err) {
      return next(err);
    }
   });
    Reservation.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '예약이 취소되었습니다..');
      res.redirect('/posts');
    });
  });

module.exports = router;
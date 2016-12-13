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

  if (!check_in) {
    return '체크인 날짜를 선택해주세요.';
  }

  if (!check_out){
    return '체크아웃 날짜를 선택해주세요.';
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
  Reservation.findOne({_id: id} ,function(err, reservation) {
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

router.delete('/:id', function(req, res, next) {
  Reservation.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '예약이 취소되었습니다.');
    res.redirect('/posts');
  });
});

router.put('/:id',needAuth, function(req, res, next) {

  Reservation.findById({_id: req.params.id}, function(err, reservation) {
    if (err) {
      return next(err);
    }
    if (!reservation) {
      req.flash('danger', '존재하지 않는 예약입니다.');
      return res.redirect('back');
    }

    reservation.status = 1;
    
    reservation.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '예약이 승인되었습니다.');
      res.redirect('back');
    });
  });
});

router.post('/:id', needAuth, function(req, res, next) {
  var post_id = req.params.id;

  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  
  var check_in = new Date(req.body.check_in);
  var check_out = new Date(req.body.check_out);

  var newReservation = new Reservation({
    check_in: check_in,
    check_out: check_out,
    people: req.body.people,
    user_id : req.user._id,
    post_id : post_id
  });
  
  newReservation.save(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success', '작성이 완료되었습니다.');
      res.redirect('/posts');
    }
  });
});

module.exports = router;
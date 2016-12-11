var express = require('express'),
    Post = require('../models/Post'),
    User = require('../models/User');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

function validateForm(form, options) {
  var title = form.title || "";
  var city = form.city || "";
  var human = form.human || "";
  var charge = form.charge || "";
  var address = form.address || "";
  var convenience = form.convenience || "";
  var rule = form.rule || "";
  var body = form.body || "";

  title = title.trim();

  if (!title) {
    return '숙소 이름을 입력해주세요.';
  }

  if (!city) {
    return '도시를 입력해주세요.';
  }
  
  if (!human) {
    return '수용인원을 입력해주세요.';
  }

  if (!charge) {
    return '요금을 입력해주세요.';
  }

  if (!address) {
    return '주소를 입력해주세요.';
  }

  if (!convenience) {
    return '편의 시설을 입력해주세요.';
  }

  if (!rule) {
    return '이용규칙을 입력해주세요.';
  }

  if (!body) {
    return '숙소에 대한 간단한 설명을 입력해주세요.';
  }

  return null;
}

/* GET users listing. */
router.get('/', needAuth, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    Post.find({}, function(err, posts) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {users: users, posts: posts});
    });
  });
    
});

router.get('/new', function(req, res, next) {
  res.render('posts/new', {messages: req.flash()});
});

router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

router.put('/:id', function(req, res, next) {
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      req.flash('danger', '존재하지 않는 게시물입니다.');
      return res.redirect('back');
    }

    post.title = req.body.title;
    post.city = req.body.city;
     post.human = req.body.human;
    post.charge = req.body.charge;
    post.address = req.body.address;
    post.convenience = req.body.convenience;
    post.rule = req.body.rule;
    post.body = req.body.body;
    
    
    post.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', '게시물 정보가 변경되었습니다.');
      res.redirect('/posts');
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success', '게시물이 삭제되었습니다.');
    res.redirect('/posts');
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/show', {post: post});
  });
});

router.post('/', function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var newPost = new Post({
    title: req.body.title,
    city: req.body.city,
    human : req.body.human,
    charge : req.body.charge,
    address : req.body.address,
    convenience : req.body.convenience,
    rule : req.body.rule,
    body: req.body.body,
     
    owner: {
    
      _id: req.user._id,
      username: req.user.name
    }
  });
  
  newPost.save(function(err) {
    if (err) {
      return next(err);
    } else {
      req.flash('success', '작성이 완료되었습니다.');
      res.redirect('/posts');
    }
  });
});


module.exports = router;

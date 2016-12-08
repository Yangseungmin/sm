var express = require('express'),
    Post = require('../models/Post');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

router.get('/', function(req, res, next) {
  
   
    res.render('posts/edit', {post: {}});
});

//화면 표현



router.get('/new', function(req, res, next) {
 
    res.render('posts/edit', {post: Post});
});
//글씨기창 표현



router.get('/:id/edit', function(req, res, next) {
    Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
    });
});
//edit


router.post('/', function(req, res, next) {

    var post = new Post({
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      password: req.body.password,
    });

    post.save(function(err) {
      if (err) {
        return next(err);
      } else {
        res.redirect('/');
    
      }
    });
  });
//쓴글 저장




router.get('/:id', function(req, res, next) {
   Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    post.read = post.read+1;
    post.save(function(err) {
      if (err) {
        return next(err);
      } else {

    res.render('posts/show', {post: post});
      }
    });
   });
  });
//쓴글 상세보기 



router.put('/:id', function(req, res, next) {

  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res.redirect('back');
    }

    if (post.password !== req.body.password) {
      return res.redirect('back');
    }

    
    post.email = req.body.email;
    post.title = req.body.title;
    post.content = req.body.content;
   

    post.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts');
    });
  });
});
//글수정기능 



router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/posts');
  });
});
//글삭제 

module.exports = router;
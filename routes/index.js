var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", {
    name: "Colin"
  });
});

router.get('/login', function(req, res, next) {
  res.render('page/login', { layout: 'plain-layout' });
});

router.get('/register', function(req, res, next) {
  res.render('page/register', { layout: 'plain-layout' });
});

module.exports = router;

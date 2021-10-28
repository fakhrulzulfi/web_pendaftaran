const express = require('express');

const router = express.Router();

const middleware = require('../middlewares/middleware');

const articleHandlers = require('../handlers/articles.handler');

const userHandlers = require('../handlers/users.handler');

/* GET home page. */
router.get('/', articleHandlers.index);

router.get('/list', articleHandlers.getAllArticles);

router.get('/article/:id', articleHandlers.getArticleFromId);

router.get('/signup', userHandlers.signUpPage);

router.post(
    '/signup', 
    middleware.checkNullValue, 
    middleware.checkEmailDuplicate,
    userHandlers.actionToSignUp
);

router.get('/login', userHandlers.loginPage);

router.post('/login', userHandlers.actionToLogin);

router.get('/logout', userHandlers.logout);

module.exports = router;

const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const middleware = require('../middlewares/middleware');

const { generateAccessToken } = require('../auth/auth');

const connection = require('../config/db');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('top.ejs');
});

router.get('/list', (req, res) => {
    connection.query(
        'SELECT * FROM articles',
        (error, results) => {
          
          res.render('list.ejs', { articles: results });
        }
    );
});

router.get('/article/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'SELECT * FROM articles WHERE id = ?',
        [id],
        (error, results) => {
            res.render('article.ejs', { article: results[0] });
        }
    );
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs', { errors: [] });
});

router.post(
    '/signup', 
    middleware.checkNullValue, 
    middleware.checkEmailDuplicate,
    (req, res) => {
        const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (error, hash) => {
      connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (error, results) => {
          const token = generateAccessToken({username, userId: results.insertId});
          res.cookie('token', token);
          res.redirect('/list');
        }
      );  
    });
    }
);

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.post('/login', (req, res) => {
    const email = req.body.email;

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (results.length > 0) {
                // Definisikan constant `plain`
                const plain = req.body.password;
                
                // Definisikan constant `hash`
                const hash = results[0].password;
                
                // Tambahkan sebuah method `compare` untuk membandingkan kata sandi
                bcrypt.compare(plain, hash, (error, isEqual) => {
                if( isEqual ) {
                    const token = generateAccessToken({username: results[0].username, userId: results[0].id});
                    res.cookie('token', token);
                    res.redirect('/list');
                } else {
                    res.redirect('/login');
                }
                });
            } else {
                res.redirect('/login');
            }
        }
    );
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/list');
});

module.exports = router;

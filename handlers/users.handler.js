const bcrypt = require('bcrypt');

const { generateAccessToken } = require('../auth/auth');

const connection = require('../config/db');


exports.signUpPage = (req, res) => {
    res.render('signup.ejs', { errors: [] });
};

exports.loginPage = (req, res) => {
    res.render('login.ejs');
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/list');
};

exports.actionToSignUp = (req, res) => {
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

exports.actionToLogin = (req, res) => {
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
};

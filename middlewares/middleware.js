const { authenticateToken } = require('../auth/auth');

const checkLogin = (req, res, next) => {
    const validate = authenticateToken(req.cookies.token);

    if (validate === undefined) {
        res.locals.username = 'Tamu';
        res.locals.isLoggedIn = false;
    } else {
        res.locals.username = validate.username;
        res.locals.isLoggedIn = true;
    }
    next();
};

const checkNullValue = (req, res, next) => {
    console.log('Pemeriksaan nilai input kosong');
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const errors = [];

    if (username.trim() === '') {
      errors.push('Nama Pengguna kosong');
    }

    if (email.trim() === '') {
      errors.push('Email kosong');
    }

    if (password === '') {
      errors.push('Kata Sandi kosong');
    }

    if (errors.length > 0) {
      res.render('signup.ejs', { errors: errors });
    } else {
      next();
    }
};

const checkEmailDuplicate = (req, res, next) => {
    console.log('Pemeriksaan email duplikat');
    const email = req.body.email;
    const errors = [];
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (results.length > 0) {
            errors.push('Failed to register user');
            res.render('signup.ejs', { errors: errors });
            } else {
            next();
            }
        }
    );    
};



module.exports = {
    checkLogin,
    checkNullValue,
    checkEmailDuplicate
};
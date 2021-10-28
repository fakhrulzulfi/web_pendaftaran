const connection = require('../config/db');


exports.index = (req, res) => {
    res.render('top.ejs');
};

exports.getAllArticles = (req, res) => {
    connection.query(
        'SELECT * FROM articles',
        (error, results) => {
          
          res.render('list.ejs', { articles: results });
        }
    );
};

exports.getArticleFromId = (req, res) => {
    const id = req.params.id;

    connection.query(
        'SELECT * FROM articles WHERE id = ?',
        [id],
        (error, results) => {
            res.render('article.ejs', { article: results[0] });
        }
    );
};

const express = require('express');

const app = express();

const goodreads = require('goodreads-api-node');

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router



let goodReadsUser = { id: null, name: null, read_books: [], reading_books: [] }


const myCredentials = {
    key: 'LCt55jANM25RMbHM51kzpg',
    secret: '5n9UpbtiQTy7ujsZdLW1G9Vj32ggftAjgIgvkjkQ'
};


const callbackURL = 'http://localhost:8000/api/goodreads_callback'
// set callbackURL together with your key/secret
const gr = goodreads(myCredentials);
gr.initOAuth(callbackURL);



router.get('/goodreads_callback', async function (req, res) {

    let oauth_token = req.query.oauth_token;
    console.log(oauth_token);

    await gr.getAccessToken();

    let userData = await gr.getCurrentUserInfo().catch((errors) => { /*handle errors here*/ console.log(errors); });

    goodReadsUser.id = userData.user.id;
    goodReadsUser.name = userData.user.name;

    console.log(userData.user.id);
    let readBooks = await gr.getBooksOnUserShelf(userData.user.id, 'read').catch((errors) => { /*handle errors here*/ console.log(errors); });

    for (let i = 0; i < readBooks.books.book.length; i++) {

        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };

        book.id = readBooks.books.book[i].id._;
        book.isbn = readBooks.books.book[i].isbn;
        book.isbn13 = readBooks.books.book[i].isbn13;
        book.title = readBooks.books.book[i].title;
        book.small_image_url = readBooks.books.book[i].small_image_url;
        book.num_pages = readBooks.books.book[i].num_pages;


        // for(let a = 0; a < readBooks.books.book[i].authors.author.length; a++) {
        //     let author = { id: null, name: null }
        //     author.id = readBooks.books.book[i].authors.author[a].id;
        //     author.name = readBooks.books.book[i].authors.author[a].name;
        //     book.authors.push(author);
        // }

        // author mapping
        let author = { id: null, name: null }
        author.id = readBooks.books.book[i].authors.author.id;
        author.name = readBooks.books.book[i].authors.author.name;

        // /////

        // console.log(book);
        let userReview = await gr.getUsersReviewForBook(goodReadsUser.id, book.id).catch((errors) => { /*handle errors here*/ console.log(errors); });

        // console.log(userReview);
        book.rates = userReview.review.rating;
        book.authors.push(author);


        goodReadsUser.read_books.push(book);
    }


    let currentlyReadingBooks = await gr.getBooksOnUserShelf(userData.user.id, 'currently-reading').catch((errors) => { /*handle errors here*/ console.log(errors); });

    for (let i = 0; i < currentlyReadingBooks.books.book.length; i++) {

        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };

        book.id = currentlyReadingBooks.books.book[i].id._;
        book.isbn = currentlyReadingBooks.books.book[i].isbn;
        book.isbn13 = currentlyReadingBooks.books.book[i].isbn13;
        book.title = currentlyReadingBooks.books.book[i].title;
        book.small_image_url = currentlyReadingBooks.books.book[i].small_image_url;
        book.num_pages = currentlyReadingBooks.books.book[i].num_pages;


        // for(let a = 0; a < currentlyReadingBooks.books.book[i].authors.author.length; a++) {
        //     let author = { id: null, name: null }
        //     author.id = currentlyReadingBooks.books.book[i].authors.author[a].id;
        //     author.name = currentlyReadingBooks.books.book[i].authors.author[a].name;
        //     book.authors.push(author);
        // }

        // author mapping
        let author = { id: null, name: null }
        author.id = currentlyReadingBooks.books.book[i].authors.author.id;
        author.name = currentlyReadingBooks.books.book[i].authors.author.name;
        // /////

        book.authors.push(author);

        goodReadsUser.reading_books.push(book);
    }

    res.json({ user: goodReadsUser });

});


// more routes for our API will happen here
const goodreadsRouter = require('./routes/goodreads.routes');

goodreadsRouter.get('/', function (req, res) {
    res.json({ message: 'friendsreads api' })
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', goodreadsRouter);

// START THE SERVER
// =============================================================================

console.log('Magic happens on http://localhost:' + port + '/api/goodreads_auth');

app.listen(port, () => { console.log('We are live on ' + port); });

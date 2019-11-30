

const goodreads = require('goodreads-api-node');
const axios = require('axios');

// let goodReadsUser = { id: null, name: null, read_books: [], reading_books: [] }

const myCredentials = {
    key: 'LCt55jANM25RMbHM51kzpg',
    secret: '5n9UpbtiQTy7ujsZdLW1G9Vj32ggftAjgIgvkjkQ'
};


const callbackURL = 'http://localhost:8000/api/goodreads_callback'
// set callbackURL together with your key/secret
const gr = goodreads(myCredentials);
gr.initOAuth(callbackURL);


exports.goodreads_schema = async function (req, res) {

    let schema = {
        user: { id: null, name: null }, read_books: [
            { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null }
        ], reading_books: [
            { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null }
        ]
    }


    res.json(schema);
};

exports.goodreads_auth = async function (req, res) {

    let url = await gr.getRequestToken()

    res.redirect(url);
};

exports.goodreads_callback = async function (req, res) {

    let result = { user: { id: null, name: null }, read_books: [], reading_books: [], authors: [] }

    let oauth_token = req.query.oauth_token;

    await gr.getAccessToken();

    let userData = await gr.getCurrentUserInfo();

    result.user.id = userData.user.id;
    result.user.name = userData.user.name;


    let readBooks = await gr.getBooksOnUserShelf(userData.user.id, 'read');

    console.log("------------------------------------------------------------------------------");
    console.log(JSON.stringify(readBooks));
    console.log("------------------------------------------------------------------------------");

    for (let i = 0; i < readBooks.books.book.length; i++) {

        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };

        let readBook = readBooks.books.book[i];

        if (typeof (readBook) === "string") {
            book.id = readBook.id._;
        } else {
            book.id = null;
        }
        if (typeof (readBook) === "string") {
            book.isbn = readBook.id.isbn;
        } else {
            book.isbn = null;
        }
        if (typeof (readBook) === "string") {
            book.isbn13 = readBook.id.isbn13;
        } else {
            book.isbn13 = null;
        }
        book.title = readBook.title;
        book.small_image_url = readBook.small_image_url;
        book.num_pages = readBook.num_pages;


        // for(let a = 0; a < readBooks.books.book[i].authors.author.length; a++) {
        //     let author = { id: null, name: null }
        //     author.id = readBooks.books.book[i].authors.author[a].id;
        //     author.name = readBooks.books.book[i].authors.author[a].name;
        //     book.authors.push(author);
        // }

        // author mapping
        let author = { id: null, name: null }
        author.id = readBook.authors.author.id;
        author.name = readBook.authors.author.name;
        book.authors.push(author);

        // /////

        // console.log(book);
        let userReview = await gr.getUsersReviewForBook(result.user.id, book.id);

        // console.log(userReview);
        book.rates = userReview.review.rating;

        result.read_books.push(book);
    }


    let currentlyReadingBooks = await gr.getBooksOnUserShelf(result.user.id, 'currently-reading');

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

        result.reading_books.push(book);
    }




    axios.put('http://elasticsearch:9200/friends/_doc/', JSON.stringify(result), { headers: { "Content-Type": "application/json" } })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });


    res.json(result);

}
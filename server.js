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





const myCredentials = {
    key: 'LCt55jANM25RMbHM51kzpg',
    secret: '5n9UpbtiQTy7ujsZdLW1G9Vj32ggftAjgIgvkjkQ'
};


const callbackURL = 'http://localhost:8000/api/goodreads_callback'
// set callbackURL together with your key/secret
const gr = goodreads(myCredentials);
gr.initOAuth(callbackURL);


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {

    // // anonymous client
    // const gr = goodreads(myCredentials);



    gr.getRequestToken()
        .then(url => {
            /* redirect your user to this url to ask for permission */
            res.redirect(url);
        });

    // gr.getBooksByAuthor('175417')
    //     .then((data) => {
    //         console.log(data);
    //         res.json({ message: data });
    //     });

    // res.json({ message: 'hooray! welcome to our api!' });
});



// router.get('/goodreads_callback', function (req, res) {

//     let oauth_token = req.query.oauth_token;
//     console.log(oauth_token);
    
//     gr.getAccessToken()
//         .then(() => {
//             /* you can now make authenticated requests */

//             gr.getCurrentUserInfo()
//                 .then((data) => {
//                     res.json({ message: data });
//                 });

//         }, (error) => console.log(error));
// });

router.get('/goodreads_callback', async function (req, res) {

    let oauth_token = req.query.oauth_token;
    console.log(oauth_token);
    
    await gr.getAccessToken();

    let userData = await gr.getCurrentUserInfo();

    console.log(userData.user.id);
    let readBooks = await gr.getBooksOnUserShelf(userData.user.id, 'read');
    let currentlyReadingBooks = await gr.getBooksOnUserShelf(userData.user.id, 'currently-reading');
    res.json({ user: userData, readBooks: readBooks, currentlyReadingBooks: currentlyReadingBooks });

});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

console.log('Magic happens on port ' + port);

app.listen(port, () => { console.log('We are live on ' + port); });



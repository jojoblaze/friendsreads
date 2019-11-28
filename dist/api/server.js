/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/controllers/goodreads.controller.js":
/*!*************************************************!*\
  !*** ./src/controllers/goodreads.controller.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\n\r\nconst goodreads = __webpack_require__(/*! goodreads-api-node */ \"goodreads-api-node\");\r\nconst axios = __webpack_require__(/*! axios */ \"axios\");\r\n\r\nlet goodReadsUser = { id: null, name: null, read_books: [], reading_books: [] }\r\n\r\nconst myCredentials = {\r\n    key: 'LCt55jANM25RMbHM51kzpg',\r\n    secret: '5n9UpbtiQTy7ujsZdLW1G9Vj32ggftAjgIgvkjkQ'\r\n};\r\n\r\n\r\nconst callbackURL = 'http://localhost:8000/api/goodreads_callback'\r\n// set callbackURL together with your key/secret\r\nconst gr = goodreads(myCredentials);\r\ngr.initOAuth(callbackURL);\r\n\r\n\r\nexports.goodreads_auth = async function (req, res) {\r\n\r\n    let url = await gr.getRequestToken()\r\n\r\n    res.redirect(url);\r\n};\r\n\r\nexports.goodreads_callback = async function (req, res) {\r\n\r\n    let oauth_token = req.query.oauth_token;\r\n    console.log(oauth_token);\r\n\r\n    await gr.getAccessToken();\r\n\r\n    let userData = await gr.getCurrentUserInfo();\r\n\r\n    goodReadsUser.id = userData.user.id;\r\n    goodReadsUser.name = userData.user.name;\r\n\r\n    console.log(userData.user.id);\r\n    let readBooks = await gr.getBooksOnUserShelf(userData.user.id, 'read');\r\n\r\n    for (let i = 0; i < readBooks.books.book.length; i++) {\r\n\r\n        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };\r\n\r\n        book.id = readBooks.books.book[i].id._;\r\n        book.isbn = readBooks.books.book[i].isbn;\r\n        book.isbn13 = readBooks.books.book[i].isbn13;\r\n        book.title = readBooks.books.book[i].title;\r\n        book.small_image_url = readBooks.books.book[i].small_image_url;\r\n        book.num_pages = readBooks.books.book[i].num_pages;\r\n\r\n\r\n        // for(let a = 0; a < readBooks.books.book[i].authors.author.length; a++) {\r\n        //     let author = { id: null, name: null }\r\n        //     author.id = readBooks.books.book[i].authors.author[a].id;\r\n        //     author.name = readBooks.books.book[i].authors.author[a].name;\r\n        //     book.authors.push(author);\r\n        // }\r\n\r\n        // author mapping\r\n        let author = { id: null, name: null }\r\n        author.id = readBooks.books.book[i].authors.author.id;\r\n        author.name = readBooks.books.book[i].authors.author.name;\r\n\r\n        // /////\r\n\r\n        // console.log(book);\r\n        let userReview = await gr.getUsersReviewForBook(goodReadsUser.id, book.id);\r\n\r\n        // console.log(userReview);\r\n        book.rates = userReview.review.rating;\r\n        book.authors.push(author);\r\n\r\n\r\n        goodReadsUser.read_books.push(book);\r\n    }\r\n\r\n\r\n    let currentlyReadingBooks = await gr.getBooksOnUserShelf(userData.user.id, 'currently-reading');\r\n\r\n    for (let i = 0; i < currentlyReadingBooks.books.book.length; i++) {\r\n\r\n        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };\r\n\r\n        book.id = currentlyReadingBooks.books.book[i].id._;\r\n        book.isbn = currentlyReadingBooks.books.book[i].isbn;\r\n        book.isbn13 = currentlyReadingBooks.books.book[i].isbn13;\r\n        book.title = currentlyReadingBooks.books.book[i].title;\r\n        book.small_image_url = currentlyReadingBooks.books.book[i].small_image_url;\r\n        book.num_pages = currentlyReadingBooks.books.book[i].num_pages;\r\n\r\n\r\n        // for(let a = 0; a < currentlyReadingBooks.books.book[i].authors.author.length; a++) {\r\n        //     let author = { id: null, name: null }\r\n        //     author.id = currentlyReadingBooks.books.book[i].authors.author[a].id;\r\n        //     author.name = currentlyReadingBooks.books.book[i].authors.author[a].name;\r\n        //     book.authors.push(author);\r\n        // }\r\n\r\n        // author mapping\r\n        let author = { id: null, name: null }\r\n        author.id = currentlyReadingBooks.books.book[i].authors.author.id;\r\n        author.name = currentlyReadingBooks.books.book[i].authors.author.name;\r\n        // /////\r\n\r\n        book.authors.push(author);\r\n\r\n        goodReadsUser.reading_books.push(book);\r\n    }\r\n\r\n\r\n\r\n\r\n    axios.put('elasticsearch:9200/goodreadsusers/_doc/', goodReadsUser, { headers: { \"Content-Type\": \"application/json\" } })\r\n        .then(response => {\r\n            console.log(response);\r\n        })\r\n        .catch(error => {\r\n            console.log(error);\r\n        });\r\n\r\n\r\n    res.json({ user: goodReadsUser });\r\n\r\n}\n\n//# sourceURL=webpack:///./src/controllers/goodreads.controller.js?");

/***/ }),

/***/ "./src/routes/goodreads.routes.js":
/*!****************************************!*\
  !*** ./src/routes/goodreads.routes.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nconst goodreadsController = __webpack_require__(/*! ../controllers/goodreads.controller */ \"./src/controllers/goodreads.controller.js\");\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nvar goodreadsRouter = express.Router(); \r\n\r\ngoodreadsRouter.get('/goodreads_auth', goodreadsController.goodreads_auth);\r\ngoodreadsRouter.get('/goodreads_callback', goodreadsController.goodreads_callback);\r\n\r\nmodule.exports = goodreadsRouter;\n\n//# sourceURL=webpack:///./src/routes/goodreads.routes.js?");

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\r\n\r\nconst app = express();\r\n\r\nconst goodreads = __webpack_require__(/*! goodreads-api-node */ \"goodreads-api-node\");\r\n\r\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\r\n\r\n// configure app to use bodyParser()\r\n// this will let us get the data from a POST\r\napp.use(bodyParser.urlencoded({ extended: true }));\r\napp.use(bodyParser.json());\r\n\r\nvar port = process.env.PORT || 8000;        // set our port\r\n\r\n// ROUTES FOR OUR API\r\n// =============================================================================\r\nvar router = express.Router();              // get an instance of the express Router\r\n\r\n\r\n\r\nlet goodReadsUser = { id: null, name: null, read_books: [], reading_books: [] }\r\n\r\n\r\nconst myCredentials = {\r\n    key: 'LCt55jANM25RMbHM51kzpg',\r\n    secret: '5n9UpbtiQTy7ujsZdLW1G9Vj32ggftAjgIgvkjkQ'\r\n};\r\n\r\n\r\nconst callbackURL = 'http://localhost:8000/api/goodreads_callback'\r\n// set callbackURL together with your key/secret\r\nconst gr = goodreads(myCredentials);\r\ngr.initOAuth(callbackURL);\r\n\r\n\r\n\r\nrouter.get('/goodreads_callback', async function (req, res) {\r\n\r\n    let oauth_token = req.query.oauth_token;\r\n    console.log(oauth_token);\r\n    \r\n    await gr.getAccessToken();\r\n\r\n    let userData = await gr.getCurrentUserInfo().catch((errors) => { /*handle errors here*/ console.log(errors); });\r\n\r\n    goodReadsUser.id = userData.user.id;\r\n    goodReadsUser.name = userData.user.name;\r\n\r\n    console.log(userData.user.id);\r\n    let readBooks = await gr.getBooksOnUserShelf(userData.user.id, 'read').catch((errors) => { /*handle errors here*/ console.log(errors); });\r\n\r\n    for(let i = 0; i < readBooks.books.book.length; i++) {\r\n        \r\n        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };\r\n\r\n        book.id = readBooks.books.book[i].id._;\r\n        book.isbn = readBooks.books.book[i].isbn;\r\n        book.isbn13 = readBooks.books.book[i].isbn13;\r\n        book.title = readBooks.books.book[i].title;\r\n        book.small_image_url = readBooks.books.book[i].small_image_url;\r\n        book.num_pages = readBooks.books.book[i].num_pages;\r\n\r\n        \r\n        // for(let a = 0; a < readBooks.books.book[i].authors.author.length; a++) {\r\n        //     let author = { id: null, name: null }\r\n        //     author.id = readBooks.books.book[i].authors.author[a].id;\r\n        //     author.name = readBooks.books.book[i].authors.author[a].name;\r\n        //     book.authors.push(author);\r\n        // }\r\n\r\n        // author mapping\r\n        let author = { id: null, name: null }\r\n        author.id = readBooks.books.book[i].authors.author.id;\r\n        author.name = readBooks.books.book[i].authors.author.name;\r\n        \r\n        // /////\r\n\r\n        // console.log(book);\r\n        let userReview = await gr.getUsersReviewForBook(goodReadsUser.id, book.id).catch((errors) => { /*handle errors here*/ console.log(errors); });\r\n\r\n        // console.log(userReview);\r\n        book.rates = userReview.review.rating;\r\n        book.authors.push(author);\r\n\r\n\r\n        goodReadsUser.read_books.push(book);\r\n    }\r\n\r\n\r\n    let currentlyReadingBooks = await gr.getBooksOnUserShelf(userData.user.id, 'currently-reading').catch((errors) => { /*handle errors here*/ console.log(errors); });\r\n\r\n    for(let i = 0; i < currentlyReadingBooks.books.book.length; i++) {\r\n        \r\n        let book = { id: null, isbn: null, isbn13: null, title: null, small_image_url: null, num_pages: null, authors: [], rates: null };\r\n\r\n        book.id = currentlyReadingBooks.books.book[i].id._;\r\n        book.isbn = currentlyReadingBooks.books.book[i].isbn;\r\n        book.isbn13 = currentlyReadingBooks.books.book[i].isbn13;\r\n        book.title = currentlyReadingBooks.books.book[i].title;\r\n        book.small_image_url = currentlyReadingBooks.books.book[i].small_image_url;\r\n        book.num_pages = currentlyReadingBooks.books.book[i].num_pages;\r\n\r\n        \r\n        // for(let a = 0; a < currentlyReadingBooks.books.book[i].authors.author.length; a++) {\r\n        //     let author = { id: null, name: null }\r\n        //     author.id = currentlyReadingBooks.books.book[i].authors.author[a].id;\r\n        //     author.name = currentlyReadingBooks.books.book[i].authors.author[a].name;\r\n        //     book.authors.push(author);\r\n        // }\r\n\r\n        // author mapping\r\n        let author = { id: null, name: null }\r\n        author.id = currentlyReadingBooks.books.book[i].authors.author.id;\r\n        author.name = currentlyReadingBooks.books.book[i].authors.author.name;\r\n        // /////\r\n        \r\n        book.authors.push(author);\r\n\r\n        goodReadsUser.reading_books.push(book);\r\n    }\r\n\r\n    res.json({ user: goodReadsUser });\r\n\r\n});\r\n\r\n\r\n// more routes for our API will happen here\r\nconst goodreadsRouter = __webpack_require__(/*! ./routes/goodreads.routes */ \"./src/routes/goodreads.routes.js\");\r\n\r\n\r\n// REGISTER OUR ROUTES -------------------------------\r\n// all of our routes will be prefixed with /api\r\napp.use('/api', goodreadsRouter);\r\n\r\n// START THE SERVER\r\n// =============================================================================\r\n\r\nconsole.log('Magic happens on http://localhost:' + port + '/api/goodreads_auth');\r\n\r\napp.listen(port, () => { console.log('We are live on ' + port); });\r\n\n\n//# sourceURL=webpack:///./src/server.js?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "goodreads-api-node":
/*!*************************************!*\
  !*** external "goodreads-api-node" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"goodreads-api-node\");\n\n//# sourceURL=webpack:///external_%22goodreads-api-node%22?");

/***/ })

/******/ });
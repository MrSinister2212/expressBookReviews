const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ----------------------------------------------------
// Register a new user
// ----------------------------------------------------
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});


// ----------------------------------------------------
// Task 1
// Get all books
// ----------------------------------------------------
public_users.get('/', function (req, res) {

    return res.status(200).json(books);

});


// ----------------------------------------------------
// Task 2
// Get book details based on ISBN
// ----------------------------------------------------
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// ----------------------------------------------------
// Task 3
// Get books based on author
// ----------------------------------------------------
public_users.get('/author/:author', function (req, res) {

    const author =
        req.params.author.toLowerCase();

    const result = {};

    Object.keys(books).forEach((isbn) => {

        if (
            books[isbn].author
                .toLowerCase()
                .includes(author)
        ) {
            result[isbn] = books[isbn];
        }

    });

    return res.status(200).json(result);
});


// ----------------------------------------------------
// Task 4
// Get books based on title
// ----------------------------------------------------
public_users.get('/title/:title', function (req, res) {

    const title =
        req.params.title.toLowerCase();

    const result = {};

    Object.keys(books).forEach((isbn) => {

        if (
            books[isbn].title
                .toLowerCase()
                .includes(title)
        ) {
            result[isbn] = books[isbn];
        }

    });

    return res.status(200).json(result);
});


// ----------------------------------------------------
// Task 5
// Get book review
// ----------------------------------------------------
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(
            books[isbn].reviews
        );
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// ====================================================
// TASKS 10 - 13
// Async/Await / Promises with Axios
// ====================================================


// ----------------------------------------------------
// Task 10
// Get all books using Async/Await with Axios
// ----------------------------------------------------
async function getAllBooks() {

    try {

        const response =
            await axios.get(
                'http://localhost:5000/'
            );

        console.log(
            "All Books:"
        );

        console.log(
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error retrieving books:",
            error.message
        );

        throw error;
    }
}


// ----------------------------------------------------
// Task 11
// Search book by ISBN using Promise with Axios
// ----------------------------------------------------
function getBookByISBN(isbn) {

    return axios
        .get(
            `http://localhost:5000/isbn/${isbn}`
        )
        .then((response) => {

            console.log(
                "Book by ISBN:"
            );

            console.log(
                response.data
            );

            return response.data;
        })
        .catch((error) => {

            console.error(
                "Error retrieving book by ISBN:",
                error.message
            );

            throw error;
        });
}


// ----------------------------------------------------
// Task 12
// Search books by Author using Async/Await with Axios
// ----------------------------------------------------
async function getBooksByAuthor(author) {

    try {

        const response =
            await axios.get(
                `http://localhost:5000/author/${encodeURIComponent(author)}`
            );

        console.log(
            "Books by Author:"
        );

        console.log(
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error retrieving books by author:",
            error.message
        );

        throw error;
    }
}


// ----------------------------------------------------
// Task 13
// Search books by Title using Promise with Axios
// ----------------------------------------------------
function getBooksByTitle(title) {

    return axios
        .get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        )
        .then((response) => {

            console.log(
                "Books by Title:"
            );

            console.log(
                response.data
            );

            return response.data;
        })
        .catch((error) => {

            console.error(
                "Error retrieving books by title:",
                error.message
            );

            throw error;
        });
}


// Export router
module.exports.general = public_users;


// Optional exports so the async methods
// are clearly visible/testable.
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;

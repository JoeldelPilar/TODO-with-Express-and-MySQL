const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config()


const connection = require('./conn');

const app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * ITEMS
 */

app.get('/items', (req, res) => {

  connection.connect((err) => {
    if (err) {
      console.log('err ', err);
    }

    connection.query('SELECT * FROM items WHERE done = 0', (err, data) => {
      if (err) {
        console.log('err ', err);
      }
      console.log('data från query', data);
      res.json(data);
    });

  });

});


app.get('/items/:listId', (req, res) => {

  let listId = req.params.listId;

  connection.connect((err) => {
    if (err) {
      console.log('err ', err);
    }

    connection.query('SELECT * FROM items WHERE done = 0 AND listId = ' + listId, (err, data) => {
      if (err) {
        console.log('err ', err);
      }
      console.log('data från query', data);
      res.json(data);
    });

  });

});


app.post('/items', (req, res) => {
  let newTodo = req.body;


  connection.connect((err) => {
    if (err) {
      console.log('err ', err);
    }

    let sql = 'INSERT INTO items (itemName, listId) VALUES ("' + newTodo.newTodoName + '", ' + newTodo.newTodoList + ')';

    connection.query(sql, (err, data) => {
      if (err) {
        console.log('err ', err);
      }
      console.log('sparad', data);
      res.json(data);
    });

  });

});


app.post('/done', (req, res) => {
  let itemDone = req.body.itemId;


  connection.connect((err) => {
    if (err) {
      console.log('err ', err);
    }

    let sql = 'UPDATE items SET done = 1 WHERE itemId = ' + itemDone;
    connection.query(sql, (err, data) => {
      if (err) {
        console.log('err ', err);
      }
      console.log('sparad', data);
      res.json(data);
    });

  });

});


/**
 * LISTOR
 */

app.get('/lists', (req, res) => {

  connection.connect((err) => {
    if (err) {
      console.log('err ', err);
    }

    connection.query('SELECT * FROM lists', (err, data) => {
      if (err) {
        console.log('err ', err);
      }
      console.log('Listor', data);
      res.json(data);
    });

  });

});

module.exports = app;

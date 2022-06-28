require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Todo = mongoose.model('Todo', {
  text: String,
  done: Boolean,
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.send(todos);
  } catch (err) {
    console.log(err);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const savedTodo = await todo.save();
    res.send(savedTodo);
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.find({ _id: req.params.id });
    todo.length > 0 ? res.send(todo) : res.sendStatus(404);
  } catch (err) {
    res.sendStatus(404);
    console.log(err);
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate({_id: req.params.id},{$set: req.body}, {returnDocument: 'after'})
    res.send(todo)
  } catch (err) {
    console.log(err)
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const { deletedCount } = await Todo.deleteOne({ _id: req.params.id });
    deletedCount > 0 ? res.sendStatus(200) : res.sendStatus(404);
  } catch (err) {
    console.log(err);
  }
});

mongoose.connect(process.env['DATABASE_URI'], (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('MongoDB connection successful!');
});

const server = app.listen(5000, () => {
  console.log(`'Starting server running on port:`, server.address().port);
});

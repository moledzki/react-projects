import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});

// get particular todo
app.get('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  function findById(element) {
    return element.id === id;
  }
  var result = db.find(findById);
  if(result != undefined) {
    return res.status(200).send({
      success: 'true',
      message: 'todo retrieved successfully',
      result,
    });
  } else {
    return res.status(404).send({
      success: 'false',
      message: 'todo does not exist',
    });
  }
});

// delete todo
app.delete('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo, index) => {
    if (todo.id === id) {
      db.splice(index, 1);
      return res.status(200).send({
        success: 'true',
        message: 'Todo deleted successfuly',
      });
    }
  });
  if(!res.headersSent) {
    return res.status(404).send({
      success: 'false',
      message: 'todo not found',
    });
  }
});

// add new todo
app.post('/api/v1/todos', (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required'
    });
  }
  const todo = {
    id: db.length + 1,
    title: req.body.title,
    description: req.body.description
  }
  db.push(todo);
  return res.status(201).send({
    success: 'true',
    message: 'todo added successfully',
    todo
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

const express = require('express')
const path = require('path')
const {
  hasStatus,
  hasPriority,
  hasStatusAndPriority,
  hasTodo,
} = require('./checkValue.js')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

dbPath = path.join(__dirname, 'todoApplication.db')

const PORT = 3000
db = null

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`)
    })
  } catch (e) {
    console.log(`Error: ${e}`)
    process.exit(1)
  }
}
initializeDBandServer()

app.get('/todos/', async (request, response) => {
  let data = null
  let getTodosQuery = ''
  const {search_q = '', priority, status} = request.query

  switch (true) {
    case hasStatusAndPriority(request.query):
      getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND status = '${status}'
          AND priority = '${priority}';`
      break
    case hasPriority(request.query):
      getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND priority = '${priority}';`
      break
    case hasStatus(request.query):
      getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND status = '${status}';`
      break
    default:
      getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%';`
  }

  data = await db.all(getTodosQuery)
  response.send(data)
})

app.get('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const getTodoQuery = `
  SELECT 
    *
  FROM
    todo
  WHERE
    id = ${todoId};
  `
  const todo = await db.get(getTodoQuery)
  response.send(todo)
})

app.post('/todos/', async (request, response) => {
  const todoData = request.body
  // console.log(todoData)
  const {id, todo, priority, status} = todoData
  const addTodoQuery = `
  INSERT INTO 
    todo
  VALUES
    (
    ${id}, 
    '${todo}', 
    '${priority}', 
    '${status}'
    );
  `
  await db.run(addTodoQuery)
  response.send('Todo Successfully Added')
})

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const data = request.body
  const {status, priority, todo} = data
  // console.log(data)
  let updateTodoQuery = ''
  switch (true) {
    case hasStatus(data):
      updateTodoQuery = `
        UPDATE
          todo
        SET
          status = '${status}'
        WHERE
          id = ${todoId};
      `
      await db.run(updateTodoQuery)
      response.send('Status Updated')
      break
    case hasPriority(data):
      updateTodoQuery = `
        UPDATE
          todo
        SET
          priority = '${priority}'
        WHERE
          id = ${todoId};
      `
      await db.run(updateTodoQuery)
      response.send('Priority Updated')
      break
    case hasTodo(data):
      updateTodoQuery = `
        UPDATE
          todo
        SET
          todo = '${todo}'
        WHERE
          id = ${todoId};
      `
      await db.run(updateTodoQuery)
      response.send('Todo Updated')
      break
    default:
      console.log('Enter a valid column')
      process.exit(1)
  }
})

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};
  `
  await db.run(deleteTodoQuery)
  response.send('Todo Deleted')
})

module.exports = app
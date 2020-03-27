//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// define the Express app
const app = express();

// the database
const tasks = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

/** task一覧取得 */
app.get('/', (req, res) => {
  const ts = tasks.map(task => ({
    id: task.id,
    comment: task.comment,
    status: task.status,
  }));
  res.send(ts);
});

/** task取得 */
app.get('/:id', (req, res) => {
  const task = tasks.filter(t => (t.id === parseInt(req.params.id)));
  if (task.length > 1) return res.status(500).send();
  if (task.length === 0) return res.status(404).send();
  res.send(task[0]);
});

/** task更新 */
app.put('/:id', (req, res) => {
  const index = tasks.findIndex((v) => v.id === parseInt(req.params.id));
  if (index < 0) return res.status(500).send();

  const {comment, status} = req.body;
  const newTask = {
    id: parseInt(req.params.id),
    comment,
    status,
  };

  tasks.splice(index, 1, newTask);
  res.status(200).send();
})

/** task追加 */
app.post('/', (req, res) => {
  const {comment, status} = req.body;
  const getId = () => {
    if(tasks.length === 0) return 1
    else return tasks[tasks.length - 1].id + 1
  }

  const newTask = {
    id: getId(),
    comment,
    status,
  };
  tasks.push(newTask);
  res.status(200).send();
});

/** task削除 */
app.delete('/:id', (req, res) => {
  const index = tasks.findIndex((v) => v.id === parseInt(req.params.id));

  if (index < 0) return res.status(500).send();

  tasks.splice(index, 1);
  res.status(200).send();
})

// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});
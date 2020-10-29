const newRelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('../db/postgres/apiQueries.js');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  const port = 3003;

  app.use('/loaderio-aa978a266c328fe1290cc543c3580998.txt', express.static(path.join(__dirname, '/../loaderio-aa978a266c328fe1290cc543c3580998.txt')));

  app.use(express.static(path.join(__dirname, '/../client/dist')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));



  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

app.get('/api/restaurants/:restaurantId/dishes/', (req, res) => {

  db.getAllDishes(req.params.restaurantId, (err, data) => {

    if (err) {
      console.log(err.sqlMessage);
      res.end('Error quering the database');
    } else {

      res.status(200).send(data.rows);
    }
  });
});

app.post('/api/restaurants/:restaurantId/dishes/', (req, res) => {

  db.createDish(req.params.restaurantId, (err, data) => {
    console.log('req.params.restaurantId', req.params.restaurantId)
    if (err) {
      console.log(err.sqlMessage);
      res.end('Error quering the database');
    } else {

      console.log('SERVER App getAllDishes getting data')
      res.status(200).send('post success');
    }
  });
});


}

cluster.on('exit', (worker, code, signal) => {
  console.log('Worker %d died with code/signal %s.', worker.process.pid, signal || code);
  cluster.fork();
});

// module.exports = app;
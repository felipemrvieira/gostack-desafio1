const express = require('express');
const server = express();

server.use(express.json());

const projects = [
  { id: "1", title: "React Jobs", tasks: ["task1", "task2"] },
  { id: "2", title: "Inova tech", tasks: ["task1", "task2"] },
  { id: "3", title: "StarFish", tasks: ["task1", "task2", "task3"] },
  { id: "4", title: "Best Prices", tasks: ["task1", "task2"] },
  { id: "5", title: "Post Tracker", tasks: ["task1", "task2", "task3", "task4"] }
];

let requestCouter = 0;

// Middleware aplicado a todas as rotas
server.use((req, res, next) => {
  requestCouter += 1;
  console.log(`Método: ${req.method}; URL: ${req.url}; Requests ${requestCouter}`);
  return next();
})

// Middleware
function checkIfProjectExists(req, res, next) {
  const project = projects[req.params.id];
  if(!project){
      return res.status(400).json({error: 'project does not exist'})
  }
  req.project = project;
  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  projects.push({id, title});
  return res.json(projects);
})

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].title = title;
  return res.json(projects);
})

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.send();
})

server.post('/projects/:id/tasks', checkIfProjectExists,  (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  projects[id].tasks.push(task);
  return res.json(projects);
})

server.listen(3000);
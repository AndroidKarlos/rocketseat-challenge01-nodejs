const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middleware
function validInputs(request, response, next) {
  const {title, url, techs} = request.body;
  if(title === ''){
    return response.status(400).json({error: 'title is required'});
  }else{
    if(url === ''){
      return response.status(400).json({error: 'url is required'});
    }else{
      if(techs === ''){
        return response.status(400).json({error: 'techs is required'});
      }else{
         next();
      }
    }
  }
}

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", validInputs, (request, response) => {
  // TODO
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", validInputs, (request, response) => {
  // TODO
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repIndex = repositories.findIndex(repository => repository.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }

  const likes = repositories[repIndex].likes;
  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: likes
  }
  repositories[repIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const {id} = request.params;

  const repIndex = repositories.findIndex(repository => repository.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: 'Repository not found'}) 
  }

  repositories.splice(repIndex , 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const {id} = request.params;

  const repIndex = repositories.findIndex(repository => repository.id === id);
  if(repIndex < 0){
    return response.status(400).json({error: 'Repository not found'}) 
  }

  const repository = repositories[repIndex];
  const newLikes = repository.likes + 1;
  const newRep = {
    id: repository.id,
    title: repository.title,
    url: repository.url,
    techs: repository.techs,
    likes: newLikes
  }
  
  repositories[repIndex] = newRep;
  return response.json(newRep);
});

module.exports = app;

import nock from 'nock';
import axios from 'axios';

// axios.defaults.adapter = require('axios/lib/adapters/http'); // Ensure Node adapter

nock.emitter.on('no match', (req) => {
  console.error('NO MATCH FOR:', req);
});

describe('MyApiClient', () => {
  afterEach(() => nock.cleanAll());

  it('can get todos', async () => {
    const todoObject = {
      todos: [
        { task: 'Two', _id: 9, completed: false },
        { task: 'three', _id: 84, completed: false },
      ],
    };

    const scope = nock('https://todo-app-barkend-b18308c4c059.herokuapp.com').get('/todos/').reply(200, todoObject);
    
    const response = await fetch('https://todo-app-barkend-b18308c4c059.herokuapp.com/todos/');

    const json = await response.json();
    
    // const res = await axios.get('https://todo-app-barkend-b18308c4c059.herokuapp.com/todos/');
    expect(response.status).toEqual(200);
    scope.done();
  });
});

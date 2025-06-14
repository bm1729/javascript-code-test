import nock from 'nock';
import { randomUUID } from 'crypto';
import got from 'got';

// axios.defaults.adapter = require('axios/lib/adapters/http'); // Ensure Node adapter

nock.emitter.on('no match', (req) => {
  console.error('NO MATCH FOR:', req);
});

// TODO Update to use latest Got and Jest ESM

describe('MyApiClient', () => {
  afterEach(() => nock.cleanAll());

  it('can get todos with got', async () => {
    const todoObject = {
      todos: [
        { task: 'Two', _id: 9, completed: false },
        { task: 'three', _id: 84, completed: false },
      ],
    };

    const scope = nock('https://todo-app-barkend-b18308c4c059.herokuapp.com').get('/todos/').reply(200, todoObject);

    const client = got.extend({
      hooks: {
        beforeRequest: [
          (options) => {
            // Generate a correlation ID for each request
            const correlationId = randomUUID();
            options.headers['x-correlation-id'] = correlationId;
            // Attach to options for later use
            (options as any)._correlationId = correlationId;
            console.log('Requesting:', options.url.href, 'Correlation ID:', correlationId);
          },
        ],
        afterResponse: [
          (response) => {
            // Retrieve the correlation ID from the request options
            const correlationId = (response.request.options as any)._correlationId;
            console.log('Response:', response.statusCode, 'Correlation ID:', correlationId);
            return response;
          },
        ],
      },
    });
    const response = await client('https://todo-app-barkend-b18308c4c059.herokuapp.com/todos/').json();

    // const res = await axios.get('https://todo-app-barkend-b18308c4c059.herokuapp.com/todos/');
    expect(response).toEqual(todoObject);
    scope.done();
  });

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

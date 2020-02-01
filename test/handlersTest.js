const request = require('supertest');

const {app} = require('../lib/handlers');

describe('GET', () => {
  it('Should give the home page of the app', (done) => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'text/html');
  });
  it('Should give not found page with status code 404', (done) => {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done)
      .expect('Content-Type', 'text/html');
  });
});


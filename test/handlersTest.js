const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');

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
  it('Should give css page with status code 200', (done) => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'text/css');
  });
  it('Should give the stringified todo list with status code 200', (done) => {
    request(app.serve.bind(app))
      .get('/todoList')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'text/plain');
  });
});

describe('POST', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  it('Should redirect to home page when new todo will add', done => {
    request(app.serve.bind(app))
      .post('/saveTodo')
      .set('Accept', '*/*')
      .send('title=groceries&items=tomato')
      .expect(302, done)
      .expect('Location', '/');
  });
  after(() => {
    sinon.restore();
  });
});

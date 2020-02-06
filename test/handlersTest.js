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
      .expect('Content-Type', 'application/json');
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
  it('Should add and redirect new todo with multiple items', done => {
    request(app.serve.bind(app))
      .post('/saveTodo')
      .set('Accept', '*/*')
      .send('title=groceries&items=[tomato,potato]')
      .expect(302, done)
      .expect('Location', '/');
  });
  it('Should update the item status when the checkbox is clicked', done => {
    request(app.serve.bind(app))
      .post('/updateItemStatus')
      .set('Accept', '*/*')
      .send('id=1_1')
      .expect(200, done);
  });
  it('Should delete the todo from the todoList', done => {
    request(app.serve.bind(app))
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('id=1')
      .expect(200, done);
  });
  it('Should delete the item from the todo', done => {
    request(app.serve.bind(app))
      .post('/removeItem')
      .set('Accept', '*/*')
      .send('id=1_1')
      .expect(200, done);
  });
  
  after(() => {
    sinon.restore();
  });
});

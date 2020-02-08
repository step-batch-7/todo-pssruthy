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
  it('Should give the specified todo with status code 200', (done) => {
    request(app.serve.bind(app))
      .get('/getTodo?id=1')
      .set('Accept', '*/*')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });
});

describe('POST', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  it('Should save and return the todo with status code 200', done => {
    request(app.serve.bind(app))
      .post('/saveNewTodo')
      .set('Accept', '*/*')
      .send('title=groceries')
      .expect(200, done)
      .expect(/"title":"groceries"/);
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
      .send('id=2_1')
      .expect(200, done);
  });
  it('Should add new item in the todo and returns the updated todo', done => {
    request(app.serve.bind(app))
      .post('/addNewItem')
      .set('Accept', '*/*')
      .send('todoId=2&item=item')
      .expect(200, done)
      .expect(/"item":"item"/);
  });
  it('Should edit a item in the todo and returns the updated todo', done => {
    request(app.serve.bind(app))
      .post('/editItem')
      .set('Accept', '*/*')
      .send('todoId=2&itemId=2_1&item=hai')
      .expect(200, done)
      .expect(/"item":"hai"/);
  });
  it('Should edit a title in the todo and returns the updated todo', done => {
    request(app.serve.bind(app))
      .post('/editTitle')
      .set('Accept', '*/*')
      .send('todoId=2&title=new')
      .expect(200, done)
      .expect(/"title":"new"/);
  });
  
  after(() => {
    sinon.restore();
  });
});

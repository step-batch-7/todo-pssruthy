const fs = require('fs');
const sinon = require('sinon');
const request = require('supertest');
const assert = require('chai').assert;
const { TodoList } = require('../lib/todoList');

const todoList = require('../test/testTodoInfo.json');

const { app } = require('../lib/appRouters');

describe('GET', () => {
  it('Should give the home page of the app', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
  it('Should give not found page with status code 404', done => {
    request(app)
      .get('/badFile')
      .set('Accept', '*/*')
      .expect('Content-Type', /text\/html/)
      .expect(404, done);
  });
  it('Should give css page with status code 200', done => {
    request(app)
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('Content-Type', /text\/css/)
      .expect(200, done);
  });
  it('Should give the stringified todo list with status code 200', done => {
    request(app)
      .get('/todoList')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        assert.deepStrictEqual(res.body, todoList);
      })
      .expect(200, done);
    sinon.restore();
  });
  it('Should give the specified todo with status code 200', done => {
    request(app)
      .get('/getTodo/1')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        assert.deepInclude(res.body, {
          title: 'home',
          id: 1,
          items: [{ id: '1_1', task: 'potato', status: false }]
        });
      })
      .expect(200, done);
  });

  it('Should give searched todo by item with status code 200', done => {
    request(app)
      .get('/search?text=home')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        assert.deepInclude(res.body, {
          title: 'home',
          id: 1,
          items: [{ id: '1_1', task: 'potato', status: false }]
        });
      })
      .expect(200, done);
  });

  it('Should give searched todo by item with status code 200', done => {
    request(app)
      .get('/search?text=potato')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        assert.deepInclude(res.body, {
          title: 'home',
          id: 1,
          items: [{ id: '1_1', task: 'potato', status: false }]
        });
      })
      .expect(200, done);
  });

  it('Should give error with 400 when text field is not in reqUrl', done => {
    request(app)
      .get('/search?hello=potato')
      .set('Accept', '*/*')
      .expect('bad request')
      .expect(400, done);
  });
});

describe('POST', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  it('Should save and return the todo with status code 200', done => {
    request(app)
      .post('/saveNewTodo')
      .set('Accept', '*/*')
      .send({ title: 'groceries' })
      .expect(/"title":"groceries"/)
      .expect(res => {
        assert.deepInclude(res.body, { title: 'groceries', id: 3, items: [] });
      })
      .expect(200, done);
  });

  it('Should add new item in the todo and returns the updated todo', done => {
    request(app)
      .post('/addNewItem')
      .set('Accept', '*/*')
      .send({ todoId: '2', item: 'item' })
      .expect(/"task":"item"/)
      .expect(res => {
        assert.deepInclude(res.body.items, {
          id: '2_2',
          task: 'item',
          status: false
        });
      })
      .expect(200, done);
  });

  after(() => {
    sinon.restore();
  });
});

describe('PATCH', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  it('Should update the item status when the checkbox is clicked', done => {
    request(app)
      .patch('/updateItemStatus')
      .set('Accept', '*/*')
      .send({ todoId: '1', itemId: '1_1' })
      .expect(200, done);
  });

  it('Should edit a item in the todo and returns the updated todo', done => {
    request(app)
      .patch('/editItem')
      .set('Accept', '*/*')
      .send({ todoId: '2', itemId: '2_1', item: 'hai' })
      .expect(/"task":"hai"/)
      .expect(res => {
        assert.deepInclude(res.body.items, {
          id: '2_1',
          task: 'hai',
          status: false
        });
      })
      .expect(200, done);
  });
  it('Should edit a title in the todo and returns the updated todo', done => {
    request(app)
      .patch('/editTitle')
      .set('Accept', '*/*')
      .send({ todoId: '2', title: 'new' })
      .expect(/"title":"new"/)
      .expect(res => {
        assert.strictEqual(res.body.title, 'new');
      })
      .expect(200, done);
  });

  after(() => {
    sinon.restore();
  });
});

describe('DELETE', () => {
  before(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });

  it('Should delete the todo from the todoList', done => {
    request(app)
      .delete('/removeTodo')
      .set('Accept', '*/*')
      .send({ todoId: '1' })
      .expect(200, done);
  });
  it('Should delete the item from the todo', done => {
    request(app)
      .delete('/removeItem')
      .set('Accept', '*/*')
      .send({ todoId: '2', itemId: '2_1' })
      .expect(200, done);
  });

  after(() => {
    sinon.restore();
  });
});

const request = require('supertest');
const app = require('../server');

describe('Task API', () => {
  let createdTaskId;
  let token;

  beforeAll(async () => {
    // Register a user to get a token
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    token = res.body.token;
  });

  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('OK');
  });

  it('GET /api/tasks should return paginated array', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tasks');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.tasks)).toBeTruthy();
  });

  it('POST /api/tasks should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        category: 'work'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    expect(res.body.priority).toBe('high');
    createdTaskId = res.body.id;
  });

  it('GET /api/tasks/:id should return the task', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(createdTaskId);
  });

  it('PUT /api/tasks/:id should update the task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'completed'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('completed');
  });

  it('DELETE /api/tasks/:id should delete the task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task deleted');
  });

  it('GET /api/tasks/:id should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404);
  });
});


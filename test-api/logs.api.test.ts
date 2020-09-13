import request from 'supertest';

import app from '../src/server/app';
import logger from '../src/server/utils/logger';

describe('PUT /api/logs', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation(jest.fn());
  });

  it('responds with 200 and no body', async () => {
    const response = await request(app)
      .put('/api/logs')
      .send({
        message: 'This is a test log',
        logType: 'info',
        logSource: 'UI',
        additionalData: {
          version: 1,
        },
      });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({});
  });
});

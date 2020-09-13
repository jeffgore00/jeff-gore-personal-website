import request from 'supertest';
import fs from 'fs';
import path from 'path';

import app from '../src/server/app';

jest.mock('date-fns', () => ({
  formatDistanceToNow: (): string => 'four hours',
}));

describe('GET /api/health', () => {
  const healthfilePath = path.join(__dirname, '../src/server/status.json');
  let healthfileContents: string;

  beforeAll(() => {
    healthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
  });

  it('responds with contents of status.json, plus the server uptime', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      ...JSON.parse(healthfileContents),
      uptime: 'four hours',
    });
  });
});

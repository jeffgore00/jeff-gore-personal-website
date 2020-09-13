import path from 'path';
import fs from 'fs';
import { Response } from 'express';

import healthCheckMiddleware from '.';

jest.mock('date-fns', () => ({
  formatDistanceToNow: (): string => 'four hours',
}));

describe('The health-check middleware', () => {
  const healthfilePath = path.join(__dirname, '../../status.json');
  let healthfileContents: string;
  let response: Partial<Response>;

  beforeAll(() => {
    response = {
      json: jest.fn(),
    } as Partial<Response>;
    healthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
  });

  it('responds with contents of status.json, plus the server uptime', () => {
    healthCheckMiddleware(null, response as Response, null);
    expect(response.json).toBeCalledWith({
      ...JSON.parse(healthfileContents),
      uptime: 'four hours',
    });
  });
});

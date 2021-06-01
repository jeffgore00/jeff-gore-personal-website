import express from 'express';

import { enabledPageRoutes } from '../../../shared/constants';
import { sendHtmlForEnabledRoutes } from '.';

jest.mock('../../../shared/constants', () => ({
  enabledPageRoutes: ['/about', '/blog', '/projects'],
}));

const app = express();
const getSpy = jest.spyOn(app, 'get');

describe('Send HTML for enabled routes', () => {
  it('Adds an Express middleware that sends index.html for any GET request to the provided routes', () => {
    sendHtmlForEnabledRoutes(app, '/sample-directory');

    // For some odd reason, the second call is for something that has nothing to do with this function.
    const calls = getSpy.mock.calls.filter((callArgs) => callArgs.length === 2);
    expect(calls.length).toEqual(3);

    expect(calls[0]).toEqual([enabledPageRoutes[0], expect.any(Function)]);
    expect(calls[1]).toEqual([enabledPageRoutes[1], expect.any(Function)]);
    expect(calls[2]).toEqual([enabledPageRoutes[2], expect.any(Function)]);
  });
});

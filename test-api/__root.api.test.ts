import request from 'supertest';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

import app from '../src/server/app';
import logger from '../src/server/utils/logger';

describe('GET /', () => {
  const indexHtmlPath = path.join(__dirname, '../public/index.html');

  beforeAll(() => {
    jest.spyOn(logger, 'error').mockImplementation(() => null);
  });

  describe('When public/index.html exists', () => {
    /* The index.html is generated from a template on the build step and is not
    committed to source control. Therefore this file is not guaranteed to exist
    before the test begins.

    Therefore this `describe` will create a dummy HTML file and delete it after
    the test completes to ensure a consistent test precondition. */
    let htmlExistedPriorToTest = true;

    beforeAll(() => {
      try {
        fs.readFileSync(indexHtmlPath);
      } catch (err) {
        htmlExistedPriorToTest = false;
        fs.writeFileSync(indexHtmlPath, '<html></html>');
      }
    });

    afterAll(() => {
      if (!htmlExistedPriorToTest) {
        fs.unlinkSync(indexHtmlPath);
      }
    });

    it('responds with 200 and public/index.html', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.header['content-type']).toEqual(
        'text/html; charset=UTF-8',
      );
    });
  });

  describe('When public/index.html does not exist', () => {
    /* The index.html is generated from a template on the build step and is not
    committed to source control. Still, it could already exist as the result of
    the local development process.

    Therefore this `describe` will delete any existing index.html file and
    restore it after completes to ensure a consistent test precondition. */
    let preexistingHtml = '';

    beforeAll(() => {
      try {
        preexistingHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        fs.unlinkSync(indexHtmlPath);
      } catch (err) {
        // do nothing, a missing index.html is what we want for this test.
      }
    });

    afterAll(() => {
      if (preexistingHtml) {
        fs.writeFileSync(indexHtmlPath, preexistingHtml);
      }
    });

    it('responds with 404', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(404);
    });
  });
});

describe('GET /bundle.js', () => {
  const bundleJsPath = path.join(__dirname, '../public/bundle.js.gz');

  /* The bundle is generated from the build step and is not committed to source control. Therefore
  this file is not guaranteed to exist before the test begins.

  If the file does not already exist, this `describe` will create a dummy bundle and delete it after
  the test completes to ensure a consistent test precondition. */
  let bundleExistedPriorToTest = true;

  beforeAll(() => {
    try {
      fs.readFileSync(bundleJsPath);
    } catch (err) {
      bundleExistedPriorToTest = false;
      fs.writeFileSync(bundleJsPath, zlib.gzipSync('function hi () {}'));
    }
  });

  afterAll(() => {
    if (!bundleExistedPriorToTest) {
      fs.unlinkSync(bundleJsPath);
    }
  });

  it('should return a gzipped version of the client JavaScript bundle', async () => {
    const response = await request(app).get('/bundle.js');

    expect(response.status).toEqual(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.header['content-type']).toEqual(
      'application/javascript; charset=utf-8',
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.header['content-encoding']).toEqual('gzip');
  });
});

describe('When a requested static file is not found', () => {
  it('responds with 404', async () => {
    const response = await request(app).get('/nonexistent-picture.jpg');
    expect(response.status).toEqual(404);
  });
});

describe('When the requested HTTP operation is not recognized', () => {
  it('responds with 404 and restates the unrecognized operation in an error message', async () => {
    let response = await request(app).get('/puppies');
    expect(response.status).toEqual(404);
    expect(response.text).toEqual(
      'Operation "GET /puppies" not recognized on this server.',
    );

    // "GET /" is valid, but not "POST /"
    response = await request(app).post('/');
    expect(response.status).toEqual(404);
    expect(response.text).toEqual(
      'Operation "POST /" not recognized on this server.',
    );
  });
});

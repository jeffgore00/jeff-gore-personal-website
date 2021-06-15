import request from 'supertest';
import path from 'path';
import fs from 'fs';

import app from '../src/server/app';
import logger from '../src/server/utils/logger';

describe('GET /api/content/:contentType/:contentId', () => {
  beforeAll(() => {
    jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    jest.spyOn(logger, 'error').mockImplementation(jest.fn());
  });

  describe('When a valid contentType and contentId are supplied', () => {
    describe('When the env is not production', () => {
      it('responds with the content and metadata', async () => {
        const response = await request(app).get(
          '/api/content/blogs/20000101-we-survived',
        );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          htmlContent: `
  <h2>We Survived</h2>
  <h3>Computers still work. An in-depth analysis of how one brave developer prevented a Y2K catastrophe.</h3>
  <p><i>January 1, 2000</i></p>
  <p>The year 2000 is here and so am I.</p>`,
          contentSubtype: 'TECH',
          contentType: 'BLOG',
          publishDate: '2000-01-01T00:00:00.000Z',
          title: 'We Survived',
          subtitle:
            'Computers still work. An in-depth analysis of how one brave developer prevented a Y2K catastrophe.',
        });
      });
    });
    describe('When the env is production', () => {
      /* Normally, the content.json file only exists in /dist/content, not /content, which has
      content source code. But because this is testing source code, not compiled code, under a 
      production like env (which normally is executed from /dist), then we need to pretend here 
      that /content is /dist/content. Hence writing a .json file to that directory. */

      const rawJson =
        '{"htmlContent":"<h2>We Survived</h2><h3>Computers still work. An in-depth analysis of how one brave developer prevented a Y2K catastrophe.</h3><p><i>January 1, 2000</i></p>","contentSubtype":"TECH","contentType":"BLOG","publishDate":"2000-01-01T00:00:00.000Z","title":"We Survived"}';

      const contentJsonPath = path.join(
        __dirname,
        '../content/blogs/20000101-we-survived/content.json',
      );

      beforeAll(() => {
        process.env.NODE_ENV = 'production';

        fs.writeFileSync(contentJsonPath, rawJson);
      });

      afterAll(() => {
        fs.unlinkSync(contentJsonPath);
      });

      it('responds with the content and metadata', async () => {
        const response = await request(app).get(
          '/api/content/blogs/20000101-we-survived',
        );
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          ...JSON.parse(rawJson),
          static: true,
        });
      });
    });
  });
  describe('When a valid contentId is not supplied', () => {
    it('responds with 404', async () => {
      const response = await request(app).get(
        '/api/content/blogs/20121122-this-blog-does-not-exist',
      );
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({});
    });
  });

  describe('When a valid contentType is not supplied', () => {
    it('responds with 404', async () => {
      const response = await request(app).get(
        '/api/content/this-category-does-not-exist/20000101-we-survived',
      );
      expect(response.status).toEqual(404);
      expect(response.body).toEqual({});
    });
  });
});

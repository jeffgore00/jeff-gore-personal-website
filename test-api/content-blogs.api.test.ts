import request from 'supertest';
import path from 'path';
import fs from 'fs';

import app from '../src/server/app';
import logger from '../src/server/utils/runtime/logger';

describe('Content API - Blogs', () => {
  beforeAll(() => {
    jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    jest.spyOn(logger, 'error').mockImplementation(jest.fn());
  });

  describe('GET /api/content/blogs/previews (summaries of multiple blogs)', () => {
    describe.each([
      ['"true"', true, 'dummy-previews.json'],
      ['NOT "true", or is absent', false, 'previews.json'],
    ])(
      'When useDummyPreviews is %s',
      (_, useDummyPreviews, contentFileName) => {
        let apiTestPath = '/api/content/blogs/previews';

        if (useDummyPreviews) {
          apiTestPath = `${apiTestPath}?useDummyPreviews=true`;
        } else {
          apiTestPath = `${apiTestPath}?useDummyPreviews=false`;
        }

        if (useDummyPreviews) {
          it('responds with all DUMMY previews in the expected format', async () => {
            const response = await request(app).get(`${apiTestPath}&page=blog`);
            Object.values(response.body).forEach((value) => {
              expect(value).toEqual(
                expect.objectContaining({
                  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
                  contentSubtype: expect.any(String), // TODO: match enum
                  contentType: expect.any(String), // TODO: match enum
                  draft: expect.any(Boolean),
                  dummy: true,
                  publishDate: expect.any(String),
                  subtitle: expect.any(String),
                  title: expect.any(String),
                  /* eslint-enable @typescript-eslint/no-unsafe-assignment */
                }),
              );
            });
          });

          it('responds with all the available DUMMY previews', async () => {
            const response = await request(app).get(`${apiTestPath}&page=blog`);

            expect(response.status).toEqual(200);
            const responseEntries = Object.entries(response.body);

            // There are a total of 10 dummy articles, 5 tech, 5 commentary. 1 of each are draft.
            // That leaves only 8 previews that should be built.
            expect(responseEntries).toHaveLength(8);
          });

          describe('When the `page=home` query parameter is provided', () => {
            it('responds with DUMMY previews limited to 3 per by content subtype', async () => {
              const response = await request(app).get(
                `${apiTestPath}&page=home`,
              );

              expect(response.status).toEqual(200);
              const responseEntries = Object.entries(response.body);

              // There are a total of 10 dummy articles, 5 tech, 5 commentary. 1 of each are draft.
              // Then homepage limits to 3 per type. Multiply that by the 2 types (tech, commentary) and you have 4.
              expect(responseEntries).toHaveLength(6);
            });
          });
        }

        describe('When process.env.NODE_ENV is "production"', () => {
          let originalProcessEnv: string;

          beforeAll(() => {
            originalProcessEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
          });

          afterAll(() => {
            process.env.NODE_ENV = originalProcessEnv;
          });

          describe(`When ${contentFileName} is present for the requested resource`, () => {
            /* Normally, the previews.json file only exists in /dist/content, not /content, which has
          content source code. But because this is testing source code, not compiled code, under a 
          production like env (which normally is executed from /dist), then we need to pretend here 
          that /content is /dist/content. Hence writing a .json file to that directory. */
            const previewsDir = path.join(
              __dirname,
              '../content/blogs/previews',
            );
            const previewsJsonDir = path.join(previewsDir, 'blog-page');
            const previewsJsonPath = path.join(
              previewsJsonDir,
              contentFileName,
            );

            const rawJson =
              '{"20500402-DUMMY-the-algorithms-that-still-matter":{"title":"The Algorithms That Still Matter","subtitle":"A cheat sheet to some fundamentals that are older than me.","publishDate":"2050-04-02T00:00:00.000Z","contentType":"BLOG","contentSubtype":"TECH","dummy":true,"draft":false}}';

            beforeAll(() => {
              fs.mkdirSync(previewsJsonDir, {
                recursive: true,
              });
              fs.writeFileSync(previewsJsonPath, rawJson);
            });

            afterAll(() => {
              fs.rmdirSync(previewsDir, {
                recursive: true,
              });
            });

            it(`responds with the parsed contents of ${contentFileName}`, async () => {
              const response = await request(app).get(
                `${apiTestPath}&page=blog`,
              );

              expect(response.status).toEqual(200);
              expect(response.body).toEqual(JSON.parse(rawJson));
            });
          });

          describe.skip(`When ${contentFileName} is NOT present for the requested resource`, () => {
            // No setup, previews.json is a build file only and should never be present in /content.

            // Why 500 rather than 404? Because both previews.json and dummy-previews.json should always exist, even if it's an empty object.
            it('responds with 500', async () => {
              const response = await request(app).get(
                `${apiTestPath}&page=blog`,
              );
              expect(response.status).toEqual(500);
            });
          });
        });
      },
    );
  });
});

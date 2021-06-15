import { getBlogMetadata } from '.';
import expectedMetadata from '../../../../../../content/blogs/20500101-DUMMY-happy-half-millenium/metadata';

describe('getBlogMetadata', () => {
  it('returns the metadata of the specified blog', async () => {
    const result = await getBlogMetadata('20500101-DUMMY-happy-half-millenium');
    expect(result).toEqual(expectedMetadata);
  });
});

import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'WebAssembly - A Blast From The Past',
  subtitle:
    'A look back at the language that was the hotness during the 2030s.',
  publishDate: new Date('2050-03-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: false,
};

export default contentMetadata;

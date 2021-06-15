import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'The Algorithms That Still Matter',
  subtitle: 'A cheat sheet to some fundamentals that are older than me.',
  publishDate: new Date('2050-04-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: false,
};

export default contentMetadata;

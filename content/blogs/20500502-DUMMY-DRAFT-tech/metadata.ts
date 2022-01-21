import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'This is a Tech Draft',
  subtitle: 'And it should not show up in previews.',
  publishDate: new Date('2050-05-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: true,
};
export default contentMetadata;

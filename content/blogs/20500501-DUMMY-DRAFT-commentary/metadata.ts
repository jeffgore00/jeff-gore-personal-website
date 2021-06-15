import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'This is a Commentary Draft',
  subtitle: 'And it should not show up in previews.',
  publishDate: new Date('2050-05-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: true,
};

export default contentMetadata;

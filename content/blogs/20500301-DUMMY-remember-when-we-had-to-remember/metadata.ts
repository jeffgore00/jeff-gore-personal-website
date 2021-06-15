import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'Remember When We Had to Remember?',
  subtitle:
    'With the latest Neuralink, we welcome the end of human memory as we know it. Is that a good thing?',
  publishDate: new Date('2050-03-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: false,
};

export default contentMetadata;

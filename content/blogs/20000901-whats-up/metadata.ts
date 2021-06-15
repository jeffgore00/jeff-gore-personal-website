import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'Whats up?',
  subtitle:
    'An exhaustive guide on greeting not only humans, but animals and even aliens.',
  publishDate: new Date('2000-09-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
};

export default contentMetadata;

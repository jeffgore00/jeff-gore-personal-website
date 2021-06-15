import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'So, is this internet thing for real?',
  subtitle: 'Short answer: yes. Long answer: read this scorching article.',
  publishDate: new Date('1997-09-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
};

export default contentMetadata;

import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'We Survived',
  subtitle:
    'Computers still work. An in-depth analysis of how one brave developer prevented a Y2K catastrophe.',
  publishDate: new Date('2000-01-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
};

export default contentMetadata;

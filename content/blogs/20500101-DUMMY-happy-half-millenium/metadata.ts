import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: "Holy God, I'm 64 Years Old",
  subtitle: 'A reflection on decades of making fart noises and bird calls.',
  publishDate: new Date('2050-01-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: false,
};

export default contentMetadata;

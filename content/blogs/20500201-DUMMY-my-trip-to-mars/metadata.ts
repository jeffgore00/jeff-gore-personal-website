import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'My Trip To Mars',
  subtitle:
    "A fun extraterrestrial jaunt, but oddly, everything smells like Cap'n Crunch.",
  publishDate: new Date('2050-02-01'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: false,
};

export default contentMetadata;

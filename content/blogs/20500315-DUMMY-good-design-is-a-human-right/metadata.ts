import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'Good Design Is A Human Right',
  subtitle:
    "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
  publishDate: new Date('2050-03-15'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: false,
};

export default contentMetadata;

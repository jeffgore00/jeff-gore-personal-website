import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'Testing Open Source Holographs',
  subtitle: "Yes, it's possible. Here's how to plork this daunting task.",
  publishDate: new Date('2050-01-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: false,
};

export default contentMetadata;

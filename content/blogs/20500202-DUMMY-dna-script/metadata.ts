import {
  ContentMetadata,
  ContentType,
  ContentSubtype,
} from '../../../src/shared/types/content-metadata';

const contentMetadata: ContentMetadata = {
  title: 'Coding Your Printed-Flesh Friends With DNAScript',
  subtitle:
    'Template-farmed humans are for casuals. As always, tinkering with the source yields the best results.',
  publishDate: new Date('2050-02-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: false,
};

export default contentMetadata;

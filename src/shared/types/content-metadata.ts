export enum ContentType {
  Blog = 'BLOG',
}

export enum ContentSubtype {
  Tech = 'TECH',
  Commentary = 'COMMENTARY',
}

export interface ContentMetadata {
  title: string;
  publishDate: Date;
  revisionDates?: Date[];
  contentType: ContentType;
  contentSubtype: ContentSubtype;
  draft: boolean;
  dummy: boolean;
  [key: string]: unknown;
}

export interface Previews {
  [key: string]: ContentMetadata;
}

export type ContentMetadataModule = { default: ContentMetadata };
export type PreviewsModule = { default: Previews };
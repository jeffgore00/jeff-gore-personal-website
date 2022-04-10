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

export interface ContentWithMetadata extends ContentMetadata {
  htmlContent: string;
}

export interface SerializedContentMetadata {
  title: string;
  subtitle?: string;
  publishDate: string;
  revisionDates?: string[];
  contentType: string;
  contentSubtype: string;
  draft: boolean;
  dummy: boolean;
  [key: string]: unknown;
}

export interface SerializedContentAndMetadata
  extends SerializedContentMetadata {
  htmlContent: string;
}

export interface Previews {
  [key: string]: ContentMetadata;
}

export interface SerializedPreviews {
  [key: string]: SerializedContentMetadata;
}

export type ContentMetadataModule = { default: ContentMetadata };
export type PreviewsModule = { default: Previews };

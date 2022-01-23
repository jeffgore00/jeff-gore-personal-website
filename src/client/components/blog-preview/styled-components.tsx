import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type BlogPreviewProps = { contentId: string };

export const BlogPreviewWrapper = styled.div.attrs(
  ({ contentId }: BlogPreviewProps) => ({
    id: `blog-preview-${contentId}`,
    className: 'single-blog-preview',
  }),
)<BlogPreviewProps>`
  margin-bottom: 1em;
`;

export const BlogPreviewTitleHeading = styled.div.attrs({
  className: 'blog-preview-title-heading',
})`
  font-weight: bold;
  margin-bottom: 0;
`;

const StandaloneLine = styled.div.attrs({
  className: 'blog-preview-type-heading',
})`
  margin-bottom: 0;
`;

export function BlogPreviewTypeHeading({
  blogType,
}: {
  blogType: string;
}): JSX.Element {
  const textColor = blogType === 'TECH' ? 'blue' : 'purple';

  return (
    <StandaloneLine>
      <span style={{ fontWeight: 'bold', color: textColor }}>{blogType}</span>
    </StandaloneLine>
  );
}

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:visited {
    color: black;
  }
  &:hover {
    text-decoration: underline;
  }
`;

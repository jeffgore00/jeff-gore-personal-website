import { useEffect } from 'react';

export function useSetPageTitle(pageName?: string): void {
  let pageTitle: string;
  if (pageName) {
    pageTitle = `Jeff Gore - ${pageName}`;
  } else {
    pageTitle = 'Jeff Gore';
  }
  useEffect(() => {
    document.head.querySelector('title').innerHTML = pageTitle;
  });
}

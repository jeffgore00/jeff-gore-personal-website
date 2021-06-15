import { useEffect } from 'react';

export function useSetPageTitle(pageName?: string): void {
  let pageTitle: string;
  if (pageName) {
    pageTitle = `${pageName} | Jeff Gore`;
  } else {
    pageTitle = 'Jeff Gore';
  }
  useEffect(() => {
    document.head.querySelector('title').innerHTML = pageTitle;
  });
}

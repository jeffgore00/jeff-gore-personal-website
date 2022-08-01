import React from 'react';
import { useLocation } from 'react-router-dom';

export function PageNotFound() {
  const location = useLocation();
  return (
    <p
      style={{ marginTop: '1em' }}
      data-testid="page-not-found"
    >{`Page ${JSON.stringify(location.pathname)} not found.`}</p>
  );
}

import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';

import { TopLevelUserInterface } from './components/top-level-user-interface';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <TopLevelUserInterface />
  </StrictMode>,
);

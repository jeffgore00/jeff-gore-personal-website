import * as ReactDOM from 'react-dom/client';
import * as React from 'react';

import { TopLevelUserInterface } from './components/top-level-user-interface';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(<TopLevelUserInterface />);

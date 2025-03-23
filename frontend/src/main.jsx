import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.jsx'

import { PbProvider } from './PbContext.jsx';

createRoot(document.getElementById('root')).render(
  <PbProvider>
    <App />
  </PbProvider>,
)

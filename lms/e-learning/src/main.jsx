import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
 import { ClerkProvider } from '@clerk/clerk-react'

// Safe element selection
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }
const container = document.getElementById('root')

if (!container) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(container)

root.render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <AppContextProvider>
    
        <App />
     

    </AppContextProvider>
    </ClerkProvider>
  </BrowserRouter>
)
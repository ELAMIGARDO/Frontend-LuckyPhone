import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CartProvider } from './context/CartContext'
import { InventoryProvider } from './context/InventoryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InventoryProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </InventoryProvider>
  </StrictMode>,
)

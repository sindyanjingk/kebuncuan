"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useParams } from 'next/navigation'

interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    description: string
    images: Array<{ url: string }>
    category: { name: string } | null
  }
}

interface Cart {
  id: string
  userId: string
  storeId: string
  items: CartItem[]
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
  session?: { user?: { email?: string | null } } | null
}

export function CartProvider({ children, session }: CartProviderProps) {
  const params = useParams()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  // Get current store slug from URL params
  const getCurrentStoreSlug = () => {
    return params?.store as string || null
  }

  const refreshCart = async () => {
    if (!session?.user?.email) {
      setCart(null)
      return
    }

    const storeSlug = getCurrentStoreSlug()
    if (!storeSlug) return

    setLoading(true)
    try {
      const response = await fetch(`/api/cart?storeSlug=${storeSlug}`)
      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      } else {
        console.error('Failed to fetch cart')
        setCart(null)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session?.user?.email) {
      throw new Error('Please login to add items to cart')
    }

    const storeSlug = getCurrentStoreSlug()
    if (!storeSlug) {
      throw new Error('Store not found')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          storeSlug,
          quantity
        })
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!session?.user?.email) {
      throw new Error('Please login to update cart')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity
        })
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    if (!session?.user?.email) {
      throw new Error('Please login to remove items')
    }

    try {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (cart?.items) {
      for (const item of cart.items) {
        await removeFromCart(item.id)
      }
    }
  }

  const getTotalItems = () => {
    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0
  }

  const getTotalPrice = () => {
    return cart?.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0
  }

  useEffect(() => {
    refreshCart()
  }, [session, params?.store])

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    refreshCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

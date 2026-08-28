export type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export type Category = {
  id: number
  name: string
  icon: string
}

export const categories: Category[] = [
  { id: 1, name: "Smartphones", icon: "📱" },
  { id: 2, name: "Laptops", icon: "💻" },
  { id: 3, name: "Audio", icon: "🎧" },
  { id: 4, name: "Tablets", icon: "📲" }
]

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 16",
    price: 79999,
    image: "https://placehold.co/300x300?text=iPhone+16",
    category: "Smartphones"
  },
  {
    id: 2,
    name: "MacBook Air",
    price: 99999,
    image: "https://placehold.co/300x300?text=MacBook+Air",
    category: "Laptops"
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 24999,
    image: "https://placehold.co/300x300?text=AirPods+Pro",
    category: "Audio"
  },
  {
    id: 4,
    name: "iPad Air",
    price: 59999,
    image: "https://placehold.co/300x300?text=iPad+Air",
    category: "Tablets"
  },
  {
    id: 5,
    name: "Samsung Galaxy S24",
    price: 74999,
    image: "https://placehold.co/300x300?text=Galaxy+S24",
    category: "Smartphones"
  },
  {
    id: 6,
    name: "Dell XPS 15",
    price: 129999,
    image: "https://placehold.co/300x300?text=Dell+XPS+15",
    category: "Laptops"
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    price: 29999,
    image: "https://placehold.co/300x300?text=Sony+WH-1000XM5",
    category: "Audio"
  },
  {
    id: 8,
    name: "iPad Pro",
    price: 89999,
    image: "https://placehold.co/300x300?text=iPad+Pro",
    category: "Tablets"
  }
]
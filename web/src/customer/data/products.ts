export type Product = {
  id: number
  name: string
  price: number
  image: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 16",
    price: 79999,
    image: "https://placehold.co/300x300?text=iPhone+16"
  },
  {
    id: 2,
    name: "MacBook Air",
    price: 99999,
    image: "https://placehold.co/300x300?text=MacBook+Air"
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 24999,
    image: "https://placehold.co/300x300?text=AirPods+Pro"
  },
  {
    id: 4,
    name: "iPad Air",
    price: 59999,
    image: "https://placehold.co/300x300?text=iPad+Air"
  }
]
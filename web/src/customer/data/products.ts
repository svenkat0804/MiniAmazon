export type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  is_active: boolean
  created_at: string
  category_id: number
  category_name: string
  image?: string
}

export type Category = {
  id: number
  name: string
  icon: string
  image: string
}

export const categories: Category[] = [
  { id: 1, name: "Implant Prosthetics", icon: "🦷", image: "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?fm=jpg&q=80&w=800&auto=format&fit=crop" },
  { id: 2, name: "Airotors", icon: "🛠️", image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800" },
  { id: 3, name: "Composite", icon: "🧪", image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800" },
  { id: 4, name: "Intra Oral Camera", icon: "📷", image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800" },
  { id: 5, name: "Endomotors", icon: "⚙️", image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800" },
  { id: 6, name: "Autoclave", icon: "🧫", image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800" },
  { id: 7, name: "Rotary Files", icon: "📂", image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800" },
  { id: 8, name: "Cements", icon: "🧴", image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800" },
  { id: 9, name: "Impression Materials", icon: "🖐️", image: "https://images.pexels.com/photos/7788360/pexels-photo-7788360.jpeg?auto=compress&w=800" },
  { id: 10, name: "Brackets", icon: "🔗", image: "https://images.pexels.com/photos/6529122/pexels-photo-6529122.jpeg?auto=compress&w=800" },
  { id: 11, name: "Sutures & Needles", icon: "💉", image: "https://images.pexels.com/photos/6627456/pexels-photo-6627456.jpeg?auto=compress&w=800" },
  { id: 12, name: "Spare Parts", icon: "🔧", image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800" }
]

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Dental Chair",
    description: "High quality dental chair with excellent performance and value.",
    price: 249999,
    stock: 10,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    category_id: 1,
    category_name: "Implant Prosthetics",
    image: "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?fm=jpg&q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "High Speed Airotor Handpiece",
    description: "High quality product with excellent performance and value.",
    price: 18999,
    stock: 25,
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
    category_id: 2,
    category_name: "Airotors",
    image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800"
  },
  {
    id: 3,
    name: "Universal Composite Kit",
    description: "High quality product with excellent performance and value.",
    price: 4599,
    stock: 50,
    is_active: true,
    created_at: "2024-01-03T00:00:00Z",
    category_id: 3,
    category_name: "Composite",
    image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800"
  },
  {
    id: 4,
    name: "Wireless Intraoral Scanner",
    description: "High quality product with excellent performance and value.",
    price: 129999,
    stock: 5,
    is_active: true,
    created_at: "2024-01-04T00:00:00Z",
    category_id: 4,
    category_name: "Intra Oral Camera",
    image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800"
  },
  {
    id: 5,
    name: "Endomotor with Apex Locator",
    description: "High quality product with excellent performance and value.",
    price: 34999,
    stock: 15,
    is_active: true,
    created_at: "2024-01-05T00:00:00Z",
    category_id: 5,
    category_name: "Endomotors",
    image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800"
  },
  {
    id: 6,
    name: "Digital Autoclave Sterilizer",
    description: "High quality product with excellent performance and value.",
    price: 58999,
    stock: 8,
    is_active: true,
    created_at: "2024-01-06T00:00:00Z",
    category_id: 6,
    category_name: "Autoclave",
    image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800"
  },
  {
    id: 7,
    name: "NiTi Rotary File Set",
    description: "High quality product with excellent performance and value.",
    price: 3299,
    stock: 100,
    is_active: true,
    created_at: "2024-01-07T00:00:00Z",
    category_id: 7,
    category_name: "Rotary Files",
    image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800"
  },
  {
    id: 8,
    name: "Dental Glass Ionomer Cement",
    description: "High quality product with excellent performance and value.",
    price: 1299,
    stock: 200,
    is_active: true,
    created_at: "2024-01-08T00:00:00Z",
    category_id: 8,
    category_name: "Cements",
    image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800"
  },
  {
    id: 9,
    name: "Silicone Impression Material",
    description: "High quality product with excellent performance and value.",
    price: 2499,
    stock: 75,
    is_active: true,
    created_at: "2024-01-09T00:00:00Z",
    category_id: 9,
    category_name: "Impression Materials",
    image: "https://images.pexels.com/photos/7788360/pexels-photo-7788360.jpeg?auto=compress&w=800"
  },
  {
    id: 10,
    name: "Metal Brackets Kit",
    description: "High quality product with excellent performance and value.",
    price: 1899,
    stock: 60,
    is_active: true,
    created_at: "2024-01-10T00:00:00Z",
    category_id: 10,
    category_name: "Brackets",
    image: "https://images.pexels.com/photos/6529122/pexels-photo-6529122.jpeg?auto=compress&w=800"
  },
  {
    id: 11,
    name: "Sterile Sutures Pack",
    description: "High quality product with excellent performance and value.",
    price: 899,
    stock: 150,
    is_active: true,
    created_at: "2024-01-11T00:00:00Z",
    category_id: 11,
    category_name: "Sutures & Needles",
    image: "https://images.pexels.com/photos/6627456/pexels-photo-6627456.jpeg?auto=compress&w=800"
  },
  {
    id: 12,
    name: "Dental Unit Spare Part",
    description: "High quality product with excellent performance and value.",
    price: 3499,
    stock: 30,
    is_active: true,
    created_at: "2024-01-12T00:00:00Z",
    category_id: 12,
    category_name: "Spare Parts",
    image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800"
  }
]

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
    price: 249999,
    image: "https://images.unsplash.com/photo-1770321119162-05c18fbcfdb9?fm=jpg&q=80&w=800&auto=format&fit=crop",
    category: "Implant Prosthetics"
  },
  {
    id: 2,
    name: "High Speed Airotor Handpiece",
    price: 18999,
    image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800",
    category: "Airotors"
  },
  {
    id: 3,
    name: "Universal Composite Kit",
    price: 4599,
    image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800",
    category: "Composite"
  },
  {
    id: 4,
    name: "Wireless Intraoral Scanner",
    price: 129999,
    image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800",
    category: "Intra Oral Camera"
  },
  {
    id: 5,
    name: "Endomotor with Apex Locator",
    price: 34999,
    image: "https://images.pexels.com/photos/6502661/pexels-photo-6502661.jpeg?auto=compress&w=800",
    category: "Endomotors"
  },
  {
    id: 6,
    name: "Digital Autoclave Sterilizer",
    price: 58999,
    image: "https://images.pexels.com/photos/3845728/pexels-photo-3845728.jpeg?auto=compress&w=800",
    category: "Autoclave"
  },
  {
    id: 7,
    name: "NiTi Rotary File Set",
    price: 3299,
    image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800",
    category: "Rotary Files"
  },
  {
    id: 8,
    name: "Dental Glass Ionomer Cement",
    price: 1299,
    image: "https://images.pexels.com/photos/3845729/pexels-photo-3845729.jpeg?auto=compress&w=800",
    category: "Cements"
  },
  {
    id: 9,
    name: "Silicone Impression Material",
    price: 2499,
    image: "https://images.pexels.com/photos/7788360/pexels-photo-7788360.jpeg?auto=compress&w=800",
    category: "Impression Materials"
  },
  {
    id: 10,
    name: "Metal Brackets Kit",
    price: 1899,
    image: "https://images.pexels.com/photos/6529122/pexels-photo-6529122.jpeg?auto=compress&w=800",
    category: "Brackets"
  },
  {
    id: 11,
    name: "Sterile Sutures Pack",
    price: 899,
    image: "https://images.pexels.com/photos/6627456/pexels-photo-6627456.jpeg?auto=compress&w=800",
    category: "Sutures & Needles"
  },
  {
    id: 12,
    name: "Dental Unit Spare Part",
    price: 3499,
    image: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&w=800",
    category: "Spare Parts"
  }
]

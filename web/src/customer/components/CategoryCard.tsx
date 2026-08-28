type CategoryCardProps = {
  category: {
    id: number
    name: string
    icon: string
    image: string
  }
  onClick: () => void
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button type="button" className="category-card" onClick={onClick}>
      <img src={category.image} alt={category.name} />
      <span className="category-name">{category.name}</span>
    </button>
  )
}

export default CategoryCard

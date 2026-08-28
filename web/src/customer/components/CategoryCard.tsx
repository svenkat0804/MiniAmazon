type CategoryCardProps = {
  category: {
    id: number
    name: string
    icon: string
  }
  onClick: () => void
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button type="button" className="category-card" onClick={onClick}>
      <span className="category-icon">{category.icon}</span>
      <span className="category-name">{category.name}</span>
    </button>
  )
}

export default CategoryCard

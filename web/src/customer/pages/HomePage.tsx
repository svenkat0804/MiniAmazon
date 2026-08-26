import ProductCard from "../components/ProductCard"
import { products } from "../data/products"

type HomePageProps = {
  searchText: string
  onProductAdded: (productName: string) => void
  onViewProduct: (productId: number) => void
}

function HomePage({
  searchText,
  onProductAdded,
  onViewProduct
}: HomePageProps) {

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )


  return (

    <div className="home-page">

      <div className="home-container">

        <div className="products-header">

          <h1>
            Products
          </h1>

          <span>
            {filteredProducts.length} products
          </span>

        </div>


        {filteredProducts.length === 0 ? (

          <div className="no-products">

            <h2>
              No products found
            </h2>

            <p>
              Try another search.
            </p>

          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                onAdded={() =>
                  onProductAdded(product.name)
                }
                onViewDetails={() =>
                  onViewProduct(product.id)
                }
              />

            ))}

          </div>

        )}

      </div>

    </div>
  )
}

export default HomePage
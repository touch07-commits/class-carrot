import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              이미지 없음
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.title}
          </h3>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {product.price.toLocaleString()}원
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">{product.sellerName}</span>
            {product.status === 'sold' && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                판매완료
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

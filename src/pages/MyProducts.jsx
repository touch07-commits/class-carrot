import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import ProductForm from '../components/ProductForm'

function MyProducts() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchMyProducts()
  }, [currentUser])

  const fetchMyProducts = async () => {
    try {
      const q = query(collection(db, 'products'), where('sellerId', '==', currentUser.uid))
      const querySnapshot = await getDocs(q)
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProducts(productsData)
    } catch (error) {
      console.error('상품 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'products', product.id))

      setProducts(products.filter((p) => p.id !== product.id))
      alert('상품이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleUpdate = async (formData) => {
    setIsSubmitting(true)

    try {
      // Firestore 업데이트
      await updateDoc(doc(db, 'products', editingProduct.id), {
        ...formData,
        updatedAt: new Date(),
      })

      alert('상품이 수정되었습니다.')
      setEditingProduct(null)
      fetchMyProducts()
    } catch (error) {
      console.error('수정 실패:', error)
      alert('수정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (editingProduct) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">상품 수정</h1>
          <button
            onClick={() => setEditingProduct(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleUpdate}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">내 상품</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">등록한 상품이 없습니다.</p>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            상품 등록하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-6">
                <div className="w-32 h-32 flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {product.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {product.price.toLocaleString()}원
                      </p>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        product.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {product.status === 'available' ? '판매중' : '판매완료'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      상세보기
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProducts

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() })
        } else {
          alert('상품을 찾을 수 없습니다.')
          navigate('/')
        }
      } catch (error) {
        console.error('상품 조회 실패:', error)
        alert('상품을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleStatusChange = async () => {
    if (!window.confirm('판매 상태를 변경하시겠습니까?')) return

    try {
      const newStatus = product.status === 'available' ? 'sold' : 'available'
      await updateDoc(doc(db, 'products', id), { status: newStatus })
      setProduct({ ...product, status: newStatus })
      alert('상태가 변경되었습니다.')
    } catch (error) {
      console.error('상태 변경 실패:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (!product) return null

  const isOwner = currentUser && currentUser.uid === product.sellerId

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
              {product.status === 'sold' && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded">
                  판매완료
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              {product.price.toLocaleString()}원
            </p>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">상품 설명</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">판매자: {product.sellerName}</p>
              <p className="text-sm text-gray-500">
                등록일: {new Date(product.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
            {isOwner && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleStatusChange}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {product.status === 'available' ? '판매완료 처리' : '판매중으로 변경'}
                </button>
                <button
                  onClick={() => navigate(`/my-products`)}
                  className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  내 상품 관리
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

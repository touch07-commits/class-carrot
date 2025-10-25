import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import ProductForm from '../components/ProductForm'

function CreateProduct() {
  const navigate = useNavigate()
  const { currentUser, userNickname } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setIsLoading(true)

    try {
      // Firestore에 상품 데이터 저장
      await addDoc(collection(db, 'products'), {
        ...formData,
        sellerId: currentUser.uid,
        sellerName: userNickname || '익명',
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      alert('상품이 등록되었습니다!')
      navigate('/')
    } catch (error) {
      console.error('상품 등록 실패:', error)
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">상품 등록</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default CreateProduct

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { currentUser, loginAnonymously } = useAuth()
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.')
      return
    }

    if (nickname.trim().length < 2) {
      alert('닉네임은 최소 2글자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)
    try {
      await loginAnonymously(nickname.trim())
      navigate('/')
    } catch (error) {
      console.error('로그인 실패:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Vibe에 오신 것을 환영합니다
        </h1>
        <p className="text-center text-gray-600 mb-8">
          학급 친구들과 함께하는 중고마켓
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="사용할 닉네임을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="20"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              2-20자의 닉네임을 입력해주세요
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '로그인 중...' : '시작하기'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          별도의 회원가입 없이 바로 시작할 수 있습니다
        </p>
      </div>
    </div>
  )
}

export default Login

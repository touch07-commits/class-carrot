import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { currentUser, userNickname, logout } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Vibe
          </Link>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to="/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  상품 등록
                </Link>
                <Link
                  to="/my-products"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  내 상품
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {userNickname ? userNickname[0].toUpperCase() : '?'}
                  </div>
                  <span className="text-sm text-gray-700">{userNickname || '사용자'}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:text-red-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

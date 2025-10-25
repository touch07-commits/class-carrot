import { createContext, useContext, useState, useEffect } from 'react'
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userNickname, setUserNickname] = useState(null)

  const loginAnonymously = async (nickname) => {
    try {
      const result = await signInAnonymously(auth)
      // 닉네임을 localStorage에 저장
      localStorage.setItem(`nickname_${result.user.uid}`, nickname)
      setUserNickname(nickname)
      return result.user
    } catch (error) {
      console.error('익명 로그인 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (currentUser) {
        localStorage.removeItem(`nickname_${currentUser.uid}`)
      }
      setUserNickname(null)
      await signOut(auth)
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        // localStorage에서 닉네임 가져오기
        const savedNickname = localStorage.getItem(`nickname_${user.uid}`)
        setUserNickname(savedNickname)
      } else {
        setUserNickname(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    userNickname,
    loginAnonymously,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/config'

export async function uploadImage(file, userId) {
  if (!file) return null

  try {
    // 파일명 생성 (userId + timestamp + 원본파일명)
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`
    const storageRef = ref(storage, `products/${userId}/${fileName}`)

    // 이미지 업로드
    const snapshot = await uploadBytes(storageRef, file)

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw error
  }
}

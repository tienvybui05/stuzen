import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import type { GpaCalculationSnapshot } from '../features/gpa/types'
import type { PlannedCourse } from '../features/planner/types'
import type { StudentTask } from '../features/tasks/types'

export type SavedGpaResult = GpaCalculationSnapshot & {
  createdAt?: unknown
  id: string
  note: string
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null,
)

const provider = new GoogleAuthProvider()
const MAX_GPA_RESULTS = 20
const FEEDBACK_THROTTLE_MS = 60_000
const FEEDBACK_THROTTLE_KEY = 'stuzen:last-feedback-at'

function requireUser() {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Bạn cần đăng nhập để thực hiện thao tác này.')
  }

  return user
}

async function upsertUserDocument(user: User) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: user.displayName ?? '',
      email: user.email ?? '',
      photoURL: user.photoURL ?? '',
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider)
  await upsertUserDocument(result.user)
  return result.user
}

export function logout() {
  return signOut(auth)
}

export function getCurrentUser() {
  return auth.currentUser
}

export async function saveGpaResult(
  data: GpaCalculationSnapshot & { note?: string },
) {
  const user = requireUser()
  const resultsRef = collection(db, 'users', user.uid, 'gpaResults')
  const existingResults = await getDocs(query(resultsRef, limit(MAX_GPA_RESULTS)))

  if (existingResults.size >= MAX_GPA_RESULTS) {
    throw new Error('Bạn đã lưu 20/20 kết quả. Hãy xóa bớt để lưu tiếp.')
  }

  const docRef = await addDoc(resultsRef, {
    currentGpa: data.currentGpa,
    currentCredits: data.completedCredits,
    email: user.email ?? '',
    targetGpa: data.targetGpa,
    remainingCredits: data.remainingCredits,
    requiredGpa: data.requiredGpa,
    note: data.note ?? '',
    status: data.status,
    totalCredits: data.totalCredits,
    uid: user.uid,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function getGpaHistory() {
  const user = requireUser()
  const resultsRef = collection(db, 'users', user.uid, 'gpaResults')
  const snapshot = await getDocs(query(resultsRef, orderBy('createdAt', 'desc')))

  return snapshot.docs.map((resultDoc) => {
    const data = resultDoc.data()

    return {
      id: resultDoc.id,
      completedCredits: Number(data.currentCredits ?? 0),
      currentGpa: Number(data.currentGpa ?? 0),
      createdAt: data.createdAt,
      email: String(data.email ?? ''),
      note: String(data.note ?? ''),
      remainingCredits: Number(data.remainingCredits ?? 0),
      requiredGpa: Number(data.requiredGpa ?? 0),
      status: data.status ?? 'feasible',
      targetGpa: Number(data.targetGpa ?? 0),
      totalCredits: Number(data.totalCredits ?? 0),
      uid: String(data.uid ?? ''),
    } as SavedGpaResult
  })
}

export async function deleteGpaResult(id: string) {
  const user = requireUser()
  await deleteDoc(doc(db, 'users', user.uid, 'gpaResults', id))
}

export async function saveTask(data: Omit<StudentTask, 'id'>) {
  const user = requireUser()
  const tasksRef = collection(db, 'users', user.uid, 'tasks')
  const docRef = await addDoc(tasksRef, {
    category: data.category,
    createdAt: data.createdAt,
    deadline: data.deadline,
    email: user.email ?? '',
    priority: data.priority,
    status: data.status,
    title: data.title,
    uid: user.uid,
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function getTasks() {
  const user = requireUser()
  const tasksRef = collection(db, 'users', user.uid, 'tasks')
  const snapshot = await getDocs(query(tasksRef, orderBy('deadline', 'asc')))

  return snapshot.docs.map((taskDoc) => {
    const data = taskDoc.data()

    return {
      category: data.category ?? 'Other',
      createdAt: String(data.createdAt ?? ''),
      deadline: String(data.deadline ?? ''),
      id: taskDoc.id,
      priority: data.priority ?? 'Medium',
      status: data.status ?? 'pending',
      title: String(data.title ?? ''),
    } as StudentTask
  })
}

export async function updateTask(data: StudentTask) {
  const user = requireUser()
  await setDoc(
    doc(db, 'users', user.uid, 'tasks', data.id),
    {
      category: data.category,
      createdAt: data.createdAt,
      deadline: data.deadline,
      email: user.email ?? '',
      priority: data.priority,
      status: data.status,
      title: data.title,
      uid: user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function deleteTask(id: string) {
  const user = requireUser()
  await deleteDoc(doc(db, 'users', user.uid, 'tasks', id))
}

export async function savePlannedCourse(data: Omit<PlannedCourse, 'id'>) {
  const user = requireUser()
  const coursesRef = collection(db, 'users', user.uid, 'plannedCourses')
  const docRef = await addDoc(coursesRef, {
    credits: data.credits,
    email: user.email ?? '',
    expectedGrade: data.expectedGrade,
    name: data.name,
    uid: user.uid,
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function getPlannedCourses() {
  const user = requireUser()
  const coursesRef = collection(db, 'users', user.uid, 'plannedCourses')
  const snapshot = await getDocs(query(coursesRef, orderBy('name', 'asc')))

  return snapshot.docs.map((courseDoc) => {
    const data = courseDoc.data()

    return {
      credits: Number(data.credits ?? 0),
      expectedGrade: Number(data.expectedGrade ?? 0),
      id: courseDoc.id,
      name: String(data.name ?? ''),
    } as PlannedCourse
  })
}

export async function updatePlannedCourse(data: PlannedCourse) {
  const user = requireUser()
  await setDoc(
    doc(db, 'users', user.uid, 'plannedCourses', data.id),
    {
      credits: data.credits,
      email: user.email ?? '',
      expectedGrade: data.expectedGrade,
      name: data.name,
      uid: user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function deletePlannedCourse(id: string) {
  const user = requireUser()
  await deleteDoc(doc(db, 'users', user.uid, 'plannedCourses', id))
}

export async function submitFeedback(message: string) {
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    throw new Error('Nhập nội dung feedback trước khi gửi.')
  }

  const lastFeedbackAt = Number(
    window.localStorage.getItem(FEEDBACK_THROTTLE_KEY) ?? 0,
  )
  const now = Date.now()
  if (now - lastFeedbackAt < FEEDBACK_THROTTLE_MS) {
    throw new Error('Bạn chỉ có thể gửi 1 feedback mỗi 60 giây.')
  }

  const user = auth.currentUser
  await addDoc(collection(db, 'feedbacks'), {
    uid: user?.uid ?? null,
    email: user?.email ?? null,
    message: trimmedMessage,
    page: window.location.pathname,
    createdAt: serverTimestamp(),
  })
  window.localStorage.setItem(FEEDBACK_THROTTLE_KEY, String(now))
}

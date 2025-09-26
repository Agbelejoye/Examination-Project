import http from './http'

export async function fetchQuizzes(params = {}) {
  const { data } = await http.get('/quizzes', { params })
  return data
}

export async function fetchQuizWithQuestions(quizId) {
  const { data } = await http.get(`/quizzes/${quizId}`, { params: { _embed: 'questions' } })
  return data
}

export async function fetchQuestionsForQuiz(quizId) {
  const { data } = await http.get('/questions', { params: { quizId } })
  return data
}

export async function fetchAnswersForQuiz(quizId) {
  const { data } = await http.get('/answers', { params: { quizId } })
  return data
}

// Auth-related
export async function fetchSchools() {
  const { data } = await http.get('/schools')
  return data
}

export async function fetchClasses(schoolId) {
  const { data } = await http.get('/classes', { params: { schoolId } })
  return data
}

export async function signUpUser(payload) {
  // payload: { name, email, password, schoolId, classId }
  const { data } = await http.post('/users', payload)
  return data
}

export async function signInUser(email, password) {
  const { data } = await http.get('/users', { params: { email, password } })
  if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid credentials')
  return data[0]
}

// Admin bulk import
export async function bulkImportQuestions(quizId, questions) {
  // questions: array of { text, options[], id? } — we will assign incremental ids if missing
  const existing = await fetchQuestionsForQuiz(quizId)
  let nextId = existing.length ? Math.max(...existing.map(q => q.id)) + 1 : 1
  const payloads = questions.map(q => ({
    id: q.id ?? nextId++,
    quizId,
    text: q.text,
    options: q.options
  }))
  const results = []
  for (const p of payloads) {
    const { data } = await http.post('/questions', p)
    results.push(data)
  }
  return results
}

export function saveAnswerToSession(quizId, questionId, selected) {
  const key = `quiz_${quizId}_answers`
  const raw = sessionStorage.getItem(key)
  const map = raw ? JSON.parse(raw) : {}
  map[questionId] = selected
  sessionStorage.setItem(key, JSON.stringify(map))
}

export function readAnswersFromSession(quizId) {
  const key = `quiz_${quizId}_answers`
  const raw = sessionStorage.getItem(key)
  return raw ? JSON.parse(raw) : {}
}

export function clearAnswersFromSession(quizId) {
  sessionStorage.removeItem(`quiz_${quizId}_answers`)
}

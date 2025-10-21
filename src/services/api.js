import http from './http'

export async function fetchQuizzes(params = {}) {
  const { data } = await http.get('/quizzes', { params })
  return data
}

// Admin: Questions CRUD
export async function createQuestion(question) {
  // question: { quizId, text, options[], id? }
  const { data } = await http.post('/questions', question)
  return data
}

export async function updateQuestion(id, patch) {
  const { data } = await http.patch(`/questions/${id}`, patch)
  return data
}

export async function deleteQuestion(id) {
  await http.delete(`/questions/${id}`)
}

// Admin: Answers helpers
export async function upsertAnswer(quizId, questionId, correct) {
  // Try find existing answer
  const { data: existing } = await http.get('/answers', { params: { quizId, questionId } })
  if (Array.isArray(existing) && existing.length) {
    const id = existing[0].id
    const { data } = await http.patch(`/answers/${id}`, { correct })
    return data
  } else {
    const { data } = await http.post('/answers', { quizId, questionId, correct })
    return data
  }
}

export async function deleteAnswerByQuestion(quizId, questionId) {
  const { data: existing } = await http.get('/answers', { params: { quizId, questionId } })
  for (const a of existing || []) {
    await http.delete(`/answers/${a.id}`)
  }
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

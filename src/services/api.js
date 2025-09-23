const API_BASE = 'http://localhost:3000' // json-server

export async function fetchQuizzes() {
  const res = await fetch(`${API_BASE}/quizzes`)
  if (!res.ok) throw new Error('Failed to fetch quizzes')
  return res.json()
}

export async function fetchQuizWithQuestions(quizId) {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}?_embed=questions`)
  if (!res.ok) throw new Error('Failed to fetch quiz')
  return res.json()
}

export async function fetchQuestionsForQuiz(quizId) {
  const res = await fetch(`${API_BASE}/questions?quizId=${quizId}`)
  if (!res.ok) throw new Error('Failed to fetch questions')
  return res.json()
}

export async function fetchAnswersForQuiz(quizId) {
  const res = await fetch(`${API_BASE}/answers?quizId=${quizId}`)
  if (!res.ok) throw new Error('Failed to fetch answers')
  return res.json()
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

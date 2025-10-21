<template>
  <div class="container py-4" style="max-width: 980px;">
    <h4 class="mb-3">Admin: Manage Questions and Answers</h4>
    <div class="row g-3 align-items-end">
      <div class="col-12 col-md-2">
        <label class="form-label">Quiz ID</label>
        <input v-model.number="quizId" type="number" class="form-control" min="1" placeholder="1" />
      </div>
      <div class="col-12 col-md-2 d-grid">
        <button class="btn btn-outline-secondary" @click="loadData" :disabled="loading">{{ loading ? 'Loading…' : 'Refresh' }}</button>
      </div>
      <div class="col-12 col-md-8 text-md-end">
        <router-link :to="`/quiz/${quizId}/start`" class="btn btn-outline-secondary">Go to Quiz Start</router-link>
      </div>
    </div>

    <hr/>

    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <h6>Bulk Import Questions</h6>
        <p class="text-muted small">JSON array of { text, options[] }.</p>
        <pre class="bg-light p-2 rounded small">[
  { "text": "What is 2 + 2?", "options": ["1","2","3","4"] },
  { "text": "Capital of France?", "options": ["Paris","Rome","Berlin","Madrid"] }
]</pre>
        <textarea v-model="jsonText" rows="8" class="form-control" placeholder='Paste questions JSON array here'></textarea>
        <div class="d-grid gap-2 d-md-flex mt-2">
          <button class="btn btn-primary" :disabled="loading" @click="importNow">{{ loading ? 'Importing…' : 'Import Questions' }}</button>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <h6>Bulk Import Answers</h6>
        <p class="text-muted small">JSON array of { questionId, correct }. QuizId will be applied automatically.</p>
        <pre class="bg-light p-2 rounded small">[
  { "questionId": 1, "correct": "4" },
  { "questionId": 2, "correct": "Paris" }
]</pre>
        <textarea v-model="answersText" rows="8" class="form-control" placeholder='Paste answers JSON array here'></textarea>
        <div class="d-grid gap-2 d-md-flex mt-2">
          <button class="btn btn-success" :disabled="loading" @click="importAnswersNow">{{ loading ? 'Saving…' : 'Import Answers' }}</button>
        </div>
      </div>
    </div>

    <div v-if="message" class="alert mt-3" :class="ok ? 'alert-success' : 'alert-danger'">{{ message }}</div>

    <hr/>

    <h6 class="mb-2">Questions in Quiz {{ quizId }}</h6>
    <div class="table-responsive">
      <table class="table align-middle table-striped">
        <thead>
          <tr>
            <th style="width:70px">ID</th>
            <th>Text</th>
            <th style="width:140px">Options</th>
            <th style="width:220px">Correct Answer</th>
            <th style="width:220px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in questions" :key="q.id">
            <td>{{ q.id }}</td>
            <td>
              <div v-if="editRowId === q.id">
                <input v-model="editText" class="form-control form-control-sm" />
              </div>
              <div v-else class="small">{{ q.text }}</div>
            </td>
            <td>
              <div v-if="editRowId === q.id">
                <textarea v-model="editOptionsText" rows="2" class="form-control form-control-sm" placeholder="Comma-separated options"></textarea>
              </div>
              <div v-else class="small">{{ q.options.length }}</div>
            </td>
            <td>
              <select class="form-select form-select-sm" :value="answersMap[q.id] || ''" @change="(e)=>saveCorrect(q, e.target.value)">
                <option value="">-- none --</option>
                <option v-for="(opt, idx) in q.options" :key="idx" :value="opt">{{ opt }}</option>
              </select>
            </td>
            <td>
              <div v-if="editRowId === q.id" class="d-flex gap-2">
                <button class="btn btn-sm btn-success" @click="saveEdit(q)">Save</button>
                <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit">Cancel</button>
              </div>
              <div v-else class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="startEdit(q)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" @click="removeQuestion(q)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="!questions.length">
            <td colspan="5" class="text-center text-muted">No questions found for this quiz.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  bulkImportQuestions,
  fetchQuestionsForQuiz,
  fetchAnswersForQuiz,
  updateQuestion,
  deleteQuestion,
  upsertAnswer
} from '@/services/api'

const quizId = ref(1)
const jsonText = ref('')
const answersText = ref('')
const loading = ref(false)
const message = ref('')
const ok = ref(false)

const questions = ref([])
const answersMap = ref({}) // { [questionId]: correct }

const editRowId = ref(null)
const editText = ref('')
const editOptionsText = ref('')

async function loadData(){
  loading.value = true
  message.value = ''
  try {
    const qs = await fetchQuestionsForQuiz(quizId.value)
    questions.value = (qs || []).map(q => ({ ...q, id: Number(q.id), quizId: Number(q.quizId) }))
    const ans = await fetchAnswersForQuiz(quizId.value)
    const map = {}
    ;(ans || []).forEach(a => { map[a.questionId] = a.correct })
    answersMap.value = map
  } catch (e) {
    message.value = e?.message || 'Failed to load questions/answers'
    ok.value = false
  } finally { loading.value = false }
}

onMounted(loadData)

async function importNow() {
  message.value = ''
  ok.value = false
  loading.value = true
  try {
    const parsed = JSON.parse(jsonText.value)
    if (!Array.isArray(parsed)) throw new Error('JSON must be an array of questions')
    const required = parsed.every(q => q && q.text && Array.isArray(q.options) && q.options.length >= 2)
    if (!required) throw new Error('Each item must have text and at least 2 options')
    const res = await bulkImportQuestions(quizId.value, parsed)
    ok.value = true
    message.value = `Imported ${res.length} questions to quiz ${quizId.value}`
    await loadData()
  } catch (e) {
    message.value = e?.message || 'Import failed'
  } finally {
    loading.value = false
  }
}

async function importAnswersNow(){
  message.value = ''
  ok.value = false
  loading.value = true
  try {
    const parsed = JSON.parse(answersText.value)
    if (!Array.isArray(parsed)) throw new Error('JSON must be an array of answers')
    let count = 0
    for (const a of parsed){
      if (a && a.questionId != null && typeof a.correct === 'string'){
        await upsertAnswer(quizId.value, Number(a.questionId), a.correct)
        count++
      }
    }
    ok.value = true
    message.value = `Saved ${count} answers for quiz ${quizId.value}`
    await loadData()
  } catch (e) {
    message.value = e?.message || 'Import answers failed'
  } finally { loading.value = false }
}

function startEdit(q){
  editRowId.value = q.id
  editText.value = q.text
  editOptionsText.value = q.options.join(', ')
}

function cancelEdit(){
  editRowId.value = null
  editText.value = ''
  editOptionsText.value = ''
}

async function saveEdit(q){
  const opts = editOptionsText.value.split(',').map(s => s.trim()).filter(Boolean)
  await updateQuestion(q.id, { text: editText.value, options: opts })
  ok.value = true
  message.value = `Question ${q.id} updated`
  cancelEdit()
  await loadData()
}

async function removeQuestion(q){
  if (confirm(`Delete question ${q.id}?`)){
    await deleteQuestion(q.id)
    ok.value = true
    message.value = `Question ${q.id} deleted`
    await loadData()
  }
}

async function saveCorrect(q, val){
  if (!val){
    // treat empty as removing answer mapping — leave as is for simplicity
    return
  }
  await upsertAnswer(quizId.value, q.id, val)
  answersMap.value[q.id] = val
}
</script>

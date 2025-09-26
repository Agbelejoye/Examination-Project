<template>
  <div class="container py-4" style="max-width: 640px;">
    <h4 class="mb-3">Admin: Bulk Import Questions</h4>
    <p class="text-muted small">Paste an array of questions in JSON format. Each item requires <code>text</code> and <code>options</code> (array).</p>

    <div class="row g-3">
      <div class="col-12 col-md-4">
        <label class="form-label">Quiz ID</label>
        <input v-model.number="quizId" type="number" class="form-control" min="1" placeholder="1" />
      </div>
      <div class="col-12 col-md-8">
        <label class="form-label">Example schema</label>
        <pre class="bg-light p-2 rounded small mb-0">[
  { "text": "What is 2 + 2?", "options": ["1","2","3","4"] },
  { "text": "Capital of France?", "options": ["Paris","Rome","Berlin","Madrid"] }
]</pre>
      </div>
      <div class="col-12">
        <label class="form-label">JSON</label>
        <textarea v-model="jsonText" rows="10" class="form-control" placeholder='Paste JSON array here'></textarea>
      </div>
      <div class="col-12 d-grid gap-2 d-md-flex">
        <button class="btn btn-primary" :disabled="loading" @click="importNow">{{ loading ? 'Importing…' : 'Import' }}</button>
        <router-link :to="`/quiz/${quizId}/start`" class="btn btn-outline-secondary">Go to Quiz Start</router-link>
      </div>
    </div>

    <div v-if="message" class="alert mt-3" :class="ok ? 'alert-success' : 'alert-danger'">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { bulkImportQuestions } from '@/services/api'

const quizId = ref(1)
const jsonText = ref('')
const loading = ref(false)
const message = ref('')
const ok = ref(false)

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
  } catch (e) {
    message.value = e?.message || 'Import failed'
  } finally {
    loading.value = false
  }
}
</script>

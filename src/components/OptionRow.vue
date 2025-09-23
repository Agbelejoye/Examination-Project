<template>
  <button
    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
    :class="{
      active: selected,
      'list-group-item-success': review && correct,
      'list-group-item-danger': review && !correct && selected
    }"
    @click="$emit('select')"
  >
    <span>{{ text }}</span>
    <span v-if="selected" class="badge bg-primary">Selected</span>
    <span v-else-if="review && correct" class="badge bg-success">Correct</span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: String,
  selected: { type: Boolean, default: false },
  review: { type: Boolean, default: false },
  correct: { type: Boolean, default: false }
})
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        :stroke-width="stroke"
        stroke="#eee" fill="none"
      />
      <circle
        :cx="size/2" :cy="size/2" :r="radius"
        :stroke-width="stroke"
        :stroke="color"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :style="{ transition: 'stroke-dashoffset 1s ease-out' }"
        :transform="`rotate(-90, ${size/2}, ${size/2})`"
      />
      <text
        :x="size/2" :y="size/2" text-anchor="middle" dominant-baseline="middle"
        class="fw-bold"
      >{{ percent }}%</text>
    </svg>
    <div class="small text-muted mt-1">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 200 },
  stroke: { type: Number, default: 12 },
  color: { type: String, default: '#0d6efd' },
  label: { type: String, default: 'Score' }
})
const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - props.percent / 100))
</script>

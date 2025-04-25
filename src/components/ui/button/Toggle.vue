<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    modelValue: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="emit('update:modelValue', !modelValue)"
    :class="
      cn(
        'relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        modelValue ? 'bg-primary' : 'bg-secondary',
        props.class
      )
    "
  >
    <span
      :class="
        cn(
          'pointer-events-none size-4 rounded-full  flex items-center justify-center shadow-lg ring-0 transition-transform',
          modelValue ? 'translate-x-7 bg-secondary' : 'translate-x-1 bg-primary'
        )
      "
    >
      <slot />
    </span>
  </button>
</template>

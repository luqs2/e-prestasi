<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  variant?: "default" | "dark" | "outline" | "card" | "button";
}>();

const variantClasses = {
  default: "bg-white border-none",
  dark: "bg-secondary text-white",
  outline: "border border-primary text-primary",
  card: "bg-white border-none",
  button: "bg-white border-none cursor-pointer active:bg-primary-foreground",
};
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-0 shadow-sm',
        props.class,
        variantClasses[props.variant || 'default']
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  TabsTriggerProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="
      cn(
        `relative px-3 py-2.5 flex-1 text-sm font-medium rounded-lg
        text-gray-600 hover:text-gray-900 
        data-[state=active]:text-Black  data-[state=active]:bg-white/5
        transition-all duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
        focus-visible:ring-offset-0 select-none
        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full
        after:bg-transparent data-[state=active]:after:bg-primary
        after:transition-all after:duration-200 after:ease-in-out
        active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none`,
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

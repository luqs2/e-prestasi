<script setup lang="ts">
import { cn } from "@/lib/utils";
import { TabsList, type TabsListProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  TabsListProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex h-8 w-fit items-center justify-center rounded-3xl p-[3px] bg-primary text-secondary',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>

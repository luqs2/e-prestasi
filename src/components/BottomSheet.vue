<template>
  <Sheet v-model:open="model">
    <SheetContent
      side="bottom"
      :class="
        cn(
          'safe-padding-bottom rounded-t-[1.5rem] border-none px-4 pt-0 outline-none [&>button]:hidden bg-white pb-2 text-black',
          isAndroid && 'safe-padding-bottom'
        )
      "
      :style="{ height: sheetHeight + 'px' }"
      aria-describedby="overlay"
    >
      <SheetHeader>
        <div
          ref="headerRef"
          class="flex w-full flex-col items-start justify-start py-2.5"
          @touchmove="onTouchTopBar"
          @touchend="endTouch"
        >
          <div
            class="w-1/2 self-center rounded border-[0.25rem] border-secondary"
          />
        </div>
      </SheetHeader>
      <VisuallyHidden>
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
      </VisuallyHidden>
      <div ref="contentRef">
        <slot />
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "reka-ui";
import { Capacitor } from "@capacitor/core";

const isAndroid = Capacitor.getPlatform() === "android";

const model = defineModel<boolean>("open");

const sheetHeight = ref();
const headerRef = ref();
const contentRef = ref();

// adjustable height using touch
function onTouchTopBar(e: TouchEvent) {
  e.preventDefault();
  const newHeight = window.innerHeight - e.touches[0].clientY;
  sheetHeight.value = newHeight;
}

function endTouch(e: TouchEvent) {
  e.preventDefault();
  const totalHeight =
    headerRef.value.offsetHeight + contentRef.value.offsetHeight + 32;
  if (sheetHeight.value < totalHeight) model.value = false;
  else sheetHeight.value = totalHeight;
}

// reset sheet height when model is reopened
watch(model, (val) => {
  let totalHeight = 0;
  if (headerRef.value && contentRef.value) {
    totalHeight =
      headerRef.value.offsetHeight + contentRef.value.offsetHeight + 32;
  }
  if (val && sheetHeight.value !== totalHeight) sheetHeight.value = undefined;
});
</script>
<style scoped></style>

<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <!-- Greetings -->
      <div>
        <p class="text-xs font-light">Good morning</p>
        <p class="text-sm font-bold">Ahmad bin Abu</p>
      </div>

      <!-- Card Progress-->
      <Card variant="dark">
        <CardContent class="flex gap-8">
          <div class="flex flex-col gap-1">
            <p class="text-primary font-semibold text-lg">Excellent!</p>
            <p class="font-semibold text-lg">Your todays plan is almost done</p>
          </div>

          <!-- Circle Progress -->
          <div class="relative h-full aspect-square">
            <ProgressRoot v-model="progress" as-child>
              <svg class="w-full h-full" viewBox="0 0 100 100">
                <!-- Background circle -->
                <path
                  :d="trackPath"
                  class="fill-none stroke-muted stroke-[6px]"
                />
                <!-- Progress circle -->
                <ProgressIndicator as-child>
                  <path
                    :d="trackPath"
                    class="fill-none stroke-primary stroke-[6px] transition-[stroke-dasharray,opacity] duration-700 data-[value='0']:opacity-0"
                    :style="{
                      'stroke-linecap': 'round',
                      'stroke-dasharray': `${dashOffset}px, ${circumference}px`,
                      'stroke-dashoffset': '0px',
                    }"
                  />
                </ProgressIndicator>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-primary"
                  >{{ progress }}%</span
                >
              </div>
            </ProgressRoot>
          </div>
        </CardContent>
      </Card>

      <!-- Todays Schedule -->
      <p class="text-sm font-bold">Today's Schedule</p>
      <Card><CardContent> </CardContent></Card>
      <Card><CardContent> </CardContent></Card>

      <!-- Buttons -->
      <div class="flex flex-row gap-4 flex-1">
        <Button class="flex flex-1"><EyeIcon />View All</Button>
        <Button class="flex flex-1"><PlusCircleIcon />Add Class</Button>
      </div>
      <Button><QrCodeIcon />Tap to Reveal QR</Button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, PlusCircleIcon, QrCodeIcon } from "lucide-vue-next";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { computed, onMounted, ref } from "vue";

const RADIUS = 45;
const circumference = 2 * Math.PI * RADIUS;

const progress = ref(0);

const dashOffset = computed(() => (progress.value / 100) * circumference);

const trackPath = computed(() => {
  const r = RADIUS;
  return `
          M 50 50
          m 0 -${r}
          a ${r} ${r} 0 1 1 0 ${r * 2}
          a ${r} ${r} 0 1 1 0 -${r * 2}
          `;
});

onMounted(() => {
  setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10;
    } else {
      progress.value = 0;
    }
  }, 1000);
});
</script>

<style scoped></style>

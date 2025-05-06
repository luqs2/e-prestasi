<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <!-- Greetings -->
      <div>
        <p class="text-xs font-light">{{ greeting }}</p>
        <p class="text-sm font-bold">{{ user?.firstName || 'User' }}</p>
      </div>

      <!-- Card Progress-->
      <Card variant="dark">
        <CardContent class="flex gap-8 p-4">
          <div class="flex flex-col gap-1 flex-1">
            <p class="text-primary font-semibold text-lg">Excellent!</p>
            <p class="font-semibold text-lg">Your todays plan is almost done</p>
          </div>

          <!-- Circle Progress -->
          <div class="relative h-full aspect-square size-36">
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
      <div v-if="todayClasses.length > 0">
        <p class="text-sm font-bold">Today's Schedule</p>
        <div class="flex gap-4">
          <Card v-for="(classItem, index) in todayClasses" :key="index" class="flex flex-1">
            <CardContent class="flex flex-col gap-4 p-4">
              <img src="" class="size-24" />

              <div class="flex flex-1 flex-col gap-1">
                <p class="text-xs font-medium">{{ classItem.classCode }}</p>
                <p class="text-sm font-bold">{{ classItem.className }}</p>
                <p class="text-xs font-light">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <p class="text-sm font-medium text-black">No classes today</p>
      </div>

      <!-- Buttons -->
      <div class="flex flex-row gap-4 flex-1">
        <Button class="flex flex-1"><EyeIcon />View All</Button>
        <Button class="flex flex-1"><PlusCircleIcon />Add Class</Button>
      </div>

      <Button @click="showQRCode = true" v-if="!showQRCode">
        <QrCodeIcon />
        Tap to Reveal QR
      </Button>
      <div class="flex flex-1 justify-center items-center" v-else>
        <qrcode-svg :value="user?.qr_id" level="L" />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import PageContainer from "@/components/PageContainer.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRoot, ProgressIndicator } from "reka-ui";
import { QrcodeSvg } from "qrcode.vue";
import { useAuthStore } from "@/stores/authStore";
import { useClassStore } from "@/stores/classStore";
import { storeToRefs } from "pinia";
import { EyeIcon, PlusCircleIcon, QrCodeIcon } from "lucide-vue-next";

const progress = ref(85)
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 18) return 'Good afternoon'
  if (hour >= 18 && hour < 22) return 'Good evening'
  return 'Good night'
})

const RADIUS = 45;
const circumference = 2 * Math.PI * RADIUS;
const showQRCode = ref(false);
const authStore = useAuthStore();
const classStore = useClassStore();
const { user } = storeToRefs(authStore);
const { joinedClasses } = storeToRefs(classStore);

// Get today's day (0 = Sunday, 1 = Monday, etc.)
const today = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
});

// Filter classes for today
const todayClasses = computed(() => {
  return joinedClasses.value.filter((classItem) => classItem.day === today.value);
});



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

// Fetch classes when component mounts
onMounted(() => {
  classStore.getJoinedClasses();
});
</script>

<style scoped></style>

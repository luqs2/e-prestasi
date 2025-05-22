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

      <!-- Today's Schedule - show only when not in expanded view -->
      <div v-if="todayClasses.length > 0 && !showAllClasses">
        <p class="text-sm font-bold">Today's Schedule</p>
        <div class="grid grid-cols-2 gap-4">
          <Card 
            v-for="(classItem, index) in todayClasses" 
            :key="index" 
            class="relative overflow-hidden h-[12rem] w-[10rem] "
            @click="router.push(`/class/details/${classItem.id}`)"
          >
            <!-- Background image with overlay -->
            <div v-if="classItem.class_img" class="absolute inset-0">
              <img 
                :src="classItem.class_img" 
                :alt="classItem.className" 
                class="w-full h-full object-cover" 
              />
              <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
            </div>
            <!-- Default background if no image -->
            <div v-else class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            
            <CardContent class="flex flex-col gap-4 p-4 relative z-10">
              <div class="flex flex-1 flex-col gap-1">
                <p class="text-xs font-medium">{{ classItem.classCode }}</p>
                <p class="text-sm font-bold">{{ classItem.className }}</p>
                <p class="text-xs font-light">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div v-else-if="!showAllClasses" class="text-center py-4">
        <p class="text-sm font-medium text-black">No classes today</p>
      </div>

      <!-- All Classes Section - only visible when expanded -->
      <div v-if="showAllClasses" class="flex flex-col gap-5">
        <!-- Your Classes -->
        <div>
          <p class="text-sm font-bold mb-2">Your Classes</p>
          <div v-if="classes.length > 0" class="grid grid-cols-2 gap-4">
            <Card 
              v-for="(classItem, index) in classes" 
              :key="index" 
              class="relative overflow-hidden h-[12rem] w-[10rem]"
              @click="router.push(`/class/details/${classItem.id}`)"
            >
              <!-- Background image with overlay -->
              <div v-if="classItem.class_img" class="absolute inset-0">
                <img 
                  :src="classItem.class_img" 
                  :alt="classItem.className" 
                  class="w-full h-full object-cover" 
                />
                <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
              </div>
              <!-- Default background if no image -->
              <div v-else class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
              
              <CardContent class="flex flex-col gap-4 p-4 relative z-10">
                <div class="flex flex-1 flex-col gap-1">
                  <p class="text-xs font-medium">{{ classItem.classCode }}</p>
                  <p class="text-sm font-bold">{{ classItem.className }}</p>
                  <p class="text-xs font-light">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else class="text-center py-4 bg-muted/10 rounded-lg">
            <p class="text-sm font-medium text-muted-foreground">No classes created yet</p>
          </div>
        </div>

        <!-- Joined Classes -->
        <div>
          <p class="text-sm font-bold mb-2">Joined Classes</p>
          <div v-if="joinedClasses.length > 0" class="grid grid-cols-2 gap-4">
            <Card 
              v-for="(classItem, index) in joinedClasses" 
              :key="index" 
              class="relative overflow-hidden h-[12rem] w-[10rem]"
              @click="router.push(`/class/details/${classItem.id}`)"
            >
              <!-- Card content same as above -->
              <div v-if="classItem.class_img" class="absolute inset-0">
                <img 
                  :src="classItem.class_img" 
                  :alt="classItem.className" 
                  class="w-full h-full object-cover" 
                />
                <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
              </div>
              <div v-else class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
              
              <CardContent class="flex flex-col gap-4 p-4 relative z-10">
                <div class="flex flex-1 flex-col gap-1">
                  <p class="text-xs font-medium">{{ classItem.classCode }}</p>
                  <p class="text-sm font-bold">{{ classItem.className }}</p>
                  <p class="text-xs font-light">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else class="text-center py-4 bg-muted/10 rounded-lg">
            <p class="text-sm font-medium text-muted-foreground">You haven't joined any classes yet</p>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-row gap-4 flex-1">
        <Button class="flex flex-1" @click="toggleViewAll">
          <component :is="showAllClasses ? EyeOffIcon : EyeIcon" class="mr-2" />
          {{ showAllClasses ? 'View Less' : 'View All' }}
        </Button>
        <Button class="flex flex-1" @click="router.push('/class')">
          <PlusCircleIcon class="mr-2" />Add Class
        </Button>
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
import { EyeIcon, PlusCircleIcon, QrCodeIcon, EyeOffIcon } from "lucide-vue-next";
import { useRouter } from "vue-router";

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
const showAllClasses = ref(false);
const authStore = useAuthStore();
const classStore = useClassStore();
const { user } = storeToRefs(authStore);
const { joinedClasses, classes } = storeToRefs(classStore);
const router = useRouter();

// Get today's day (0 = Sunday, 1 = Monday, etc.)
const today = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
});

// Add parameter type to normalize day function
function normalizeDay(day: string | undefined | null): string {
  if (!day) return '';
  return day.toLowerCase();
}

const todayClasses = computed(() => {
  return joinedClasses.value.filter((classItem) => 
    normalizeDay(classItem.day) === normalizeDay(today.value)
  );
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

function toggleViewAll() {
  showAllClasses.value = !showAllClasses.value;
}

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
  classStore.getClasses();
  classStore.getJoinedClasses();
  classStore.getJoinedClasses().then(() => {
    console.log("All joined classes:", joinedClasses.value);
    console.log("Today is:", today.value);
    console.log("Filtered classes for today:", todayClasses.value);
  });
});
</script>

<style scoped></style>

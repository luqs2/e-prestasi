<template>
  <PageContainer>
    <div class="flex flex-col gap-8">
      <!-- Modern Header Section -->
      <div class="flex justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
        <div>
          <span class="text-xs  text-black/80 font-extrabold uppercase tracking-wider">{{ today }}</span>
          <h1 class="text-3xl font-bold text-black mt-1">{{ greeting }}</h1>
          <p class="text-lg text-gray-600 mt-1">Welcome back, <span class="font-semibold">{{ user?.firstName || 'User' }}</span></p>
        </div>
        
        <Button 
          variant="ghost" 
          class="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300" 
          @click="showQRCode = !showQRCode"
        >
          <QrCodeIcon class="size-6" />
          
        </Button>
      </div>

      <!-- QR Code - Improved styling -->
      <div v-if="showQRCode" class="animate-fadeIn">
        <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="p-2 bg-primary/5 rounded-xl">
              <qrcode-svg :value="user?.qr_id || 'https://example.com'" :size="200" level="L" />
            </div>
            <div class="text-center">
              <p class="text-gray-500 text-sm">Your personal QR code</p>
              <p class="text-xs text-gray-400 mt-1">Use this to quickly sign in to classes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Card - More modern design -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-white border-none shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 " >
          <CardContent class="flex items-center gap-6 p-6 relative">
            <!-- Decorative elements -->
            <div class="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
            
            <div class="flex-1 z-10">
              <h2 class="text-xl font-bold text-black mb-3">Progress Overview</h2>
              <p class="text-gray-700 mb-4">Your daily tasks are almost complete!</p>
              <div class="flex items-center gap-2">
                <div class="bg-primary/20 px-3 py-1 rounded-full">
                  <span class="text-sm font-medium text-primary">{{ progress }}% Complete</span>
                </div>
              </div>
            </div>
            
            <!-- Circle Progress - Enhanced -->
            <div class="relative h-full aspect-square w-28 z-10">
              <ProgressRoot v-model="progress" as-child>
                <svg class="w-full h-full" viewBox="0 0 100 100">
                  <path
                    :d="trackPath"
                    class="fill-none stroke-gray-200 stroke-[8px]"
                  />
                  <ProgressIndicator as-child>
                    <path
                      :d="trackPath"
                      class="fill-none stroke-primary stroke-[8px] transition-all duration-700"
                      :style="{
                        'stroke-linecap': 'round',
                        'stroke-dasharray': `${dashOffset}px, ${circumference}px`,
                        'stroke-dashoffset': '0px',
                      }"
                    />
                  </ProgressIndicator>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold text-primary">{{ progress }}%</span>
                </div>
              </ProgressRoot>
            </div>
          </CardContent>
        </Card>

        <!-- Summary stats card -->
        <Card class="bg-white border-none shadow-md overflow-hidden">
          <CardContent class="p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Quick Summary</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <span class="text-gray-600 text-sm">Classes Today</span>
                <span class="text-primary font-semibold">{{ todayClasses.length }}</span>
              </div>
              <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <span class="text-gray-600 text-sm">Your Classes</span>
                <span class="text-primary font-semibold">{{ classes.length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 text-sm">Joined Classes</span>
                <span class="text-primary font-semibold">{{ joinedClasses.length }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Schedule Section - Improved design -->
      <div class="mt-2">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ showAllClasses ? 'All Classes' : "Today's Schedule" }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">{{ showAllClasses ? 'All your created and joined classes' : 'Classes scheduled for today' }}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            class="flex items-center gap-2 rounded-full px-4"
            @click="toggleViewAll"
          >
            <component :is="showAllClasses ? EyeOffIcon : EyeIcon" class="size-4" />
            {{ showAllClasses ? 'Today Only' : 'View All' }}
          </Button>
        </div>

        <!-- Today's Classes - Enhanced cards -->
        <div v-if="!showAllClasses">
          <div v-if="todayClasses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Card 
              v-for="(classItem, index) in todayClasses" 
              :key="index" 
              class="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none"
              @click="router.push(`/class/details/${classItem.id}`)"
            >
              <!-- Background with overlay -->
              <div v-if="classItem.class_img" class="absolute inset-0">
                <img 
                  :src="classItem.class_img" 
                  :alt="classItem.className" 
                  class="w-full h-full object-cover" 
                />
                <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:opacity-90 transition-opacity"></div>
              </div>
              <!-- Default background if no image -->
              <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50"></div>
              
              <CardContent class="flex flex-col p-6 relative z-10 h-[180px]">
                <div class="bg-white/30 text-xs font-medium py-1 px-3 rounded-full w-fit mb-3 backdrop-blur-sm">
                  {{ classItem.classCode }}
                </div>
                <h3 class="text-xl font-bold mb-1 text-white">{{ classItem.className }}</h3>
                <div class="mt-auto flex items-center gap-3">
                  <div class="p-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <p class="text-sm font-medium text-white">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
            <div class="max-w-md mx-auto">
              <div class="text-primary/30 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <p class="text-gray-500 mb-3">No classes scheduled for today</p>
              <p class="text-gray-400 text-sm mb-5">Enjoy your free time or check out other classes</p>
              <Button 
                variant="outline" 
                size="sm" 
                @click="router.push('/class')" 
                class="rounded-full px-5"
              >
                Browse Classes
              </Button>
            </div>
          </div>
        </div>

        <!-- All Classes - Enhanced layout -->
        <div v-if="showAllClasses" class="space-y-8">
          <!-- Your Classes -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span class="p-1 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
              </span>
              Your Classes
            </h3>
            <div v-if="classes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card 
                v-for="(classItem, index) in classes" 
                :key="index" 
                class="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none"
                @click="router.push(`/class/details/${classItem.id}`)"
              >
                <div v-if="classItem.class_img" class="absolute inset-0">
                  <img 
                    :src="classItem.class_img" 
                    :alt="classItem.className" 
                    class="w-full h-full object-cover" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:opacity-90 transition-opacity"></div>
                </div>
                <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50"></div>
                
                <CardContent class="flex flex-col p-6 relative z-10 h-[180px]">
                  <div class="bg-white/30 text-xs font-medium py-1 px-3 rounded-full w-fit mb-3 backdrop-blur-sm">
                    {{ classItem.classCode }}
                  </div>
                  <h3 class="text-xl font-bold mb-1 text-white">{{ classItem.className }}</h3>
                  <div class="mt-auto flex items-center gap-3">
                    <div class="p-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <p class="text-sm font-medium text-white">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div v-else class="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <p class="text-gray-500">You haven't created any classes yet</p>
            </div>
          </div>

          <!-- Joined Classes -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <span class="p-1 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              Joined Classes
            </h3>
            <div v-if="joinedClasses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card 
                v-for="(classItem, index) in joinedClasses" 
                :key="index" 
                class="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none"
                @click="router.push(`/class/details/${classItem.id}`)"
              >
                <div v-if="classItem.class_img" class="absolute inset-0">
                  <img 
                    :src="classItem.class_img" 
                    :alt="classItem.className" 
                    class="w-full h-full object-cover" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:opacity-90 transition-opacity"></div>
                </div>
                <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50"></div>
                
                <CardContent class="flex flex-col p-6 relative z-10 h-[180px]">
                  <div class="bg-white/30 text-xs font-medium py-1 px-3 rounded-full w-fit mb-3 backdrop-blur-sm">
                    {{ classItem.classCode }}
                  </div>
                  <h3 class="text-xl font-bold mb-1 text-black">{{ classItem.className }}</h3>
                  <div class="mt-auto flex items-center gap-3">
                    <div class="p-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <p class="text-sm font-semibold text-black">{{ classItem.timeFrom }} - {{ classItem.timeTo }}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div v-else class="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <p class="text-gray-500">You haven't joined any classes yet</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button - More modern styling -->
      <Button 
        class="mt-6 w-full py-5 text-base font-medium bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 group transition-all duration-300" 
        @click="showNewClassModal = true"
      >
        <div class="relative flex items-center justify-center">
          <span class="text-black font-semibold">Add New Class</span>
          <PlusCircleIcon class="ml-2 text-black group-hover:scale-110 transition-transform"  />
        </div>
      </Button>

      <!-- New Class Modal -->
      <NewClassSheet v-model:open="showNewClassModal" />
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
import NewClassSheet from "@/components/NewClassSheet.vue";

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
const showNewClassModal = ref(false);
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
  // Update progress for demo purposes
  setInterval(() => {
    if (progress.value < 100) {
      progress.value += 5;
    } else {
      progress.value = 0;
    }
  }, 2000);
  
  // Fetch classes
  classStore.getClasses();
  classStore.getJoinedClasses();
});
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

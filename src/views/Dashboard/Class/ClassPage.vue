<template>
  <PageContainer>
    <div class="flex flex-col gap-8">
      <!-- Modern Header Section -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
  <div>
    <h1 class="text-3xl font-bold text-black">Classes</h1>
    <p class="text-lg text-gray-600 mt-1">Manage your learning spaces</p>
  </div>
  
  <div class="flex gap-2 self-start md:self-auto mt-2 md:mt-0">
    <Button 
      variant="outline" 
      size="sm"
      class="flex items-center gap-1.5 rounded-full px-4"
      @click="isAddSheetOpen = true"
    >
      <PlusCircleIcon class="size-4" />
      Create
    </Button>
    <Button 
      variant="outline" 
      size="sm"
      class="flex items-center gap-1.5 rounded-full px-4"
      @click="isJoinSheetOpen = true"
    >
      <UsersIcon class="size-4" />
      Join
    </Button>
  </div>
</div>

      <!-- Tabs Section with improved styling -->
      <Tabs default-value="myClasses" class="flex flex-col gap-6">
        <TabsList class="w-full bg-gray-50 p-1 rounded-xl">
          <TabsTrigger value="myClasses" class="data-[state=active]:bg-white data-[state=active]:shadow-sm"> 
            <div class="flex items-center gap-2">
              <SchoolIcon class="size-4" />
              <span>My Classes</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="joinedClasses" class="data-[state=active]:bg-white data-[state=active]:shadow-sm"> 
            <div class="flex items-center gap-2">
              <UsersIcon class="size-4" />
              <span>Joined Classes</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <!-- My Classes Tab Content -->
        <TabsContent value="myClasses" class="mt-0">
          <div class="flex flex-col gap-5">
            <!-- Loading State -->
            <div class="flex flex-1 items-center justify-center py-12" v-if="isLoading">
              <div class="flex flex-col items-center gap-4">
                <IonSpinner class="size-12 text-primary" />
                <p class="text-gray-500 text-sm animate-pulse">Loading your classes...</p>
              </div>
            </div>

            <!-- Classes List -->
            <div v-else>
              <div v-if="classes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Card component for each class -->
                <Card 
                  v-for="cls in classes" 
                  :key="cls.id" 
                  class="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none"
                  @click="router.push(`/class/details/${cls.id}`)"
                >
                  <!-- Background with overlay -->
                  <div v-if="cls.class_img" class="absolute inset-0">
                    <img 
                      :src="cls.class_img" 
                      :alt="cls.className" 
                      class="w-full h-full object-cover" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:opacity-90 transition-opacity"></div>
                  </div>
                  <!-- Default background if no image -->
                  <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50"></div>
                  
                  <CardContent class="flex flex-col p-4 relative z-10 h-[140px]">
                    <div class="bg-white/30 text-[10px] font-medium py-0.5 px-2 rounded-full w-fit mb-2 backdrop-blur-sm">
                      <span class="text-black">{{ cls.classCode }}</span>
                    </div>
                    <h3 class="text-base font-bold text-black line-clamp-2">{{ cls.className }}</h3>
                    <div class="mt-auto flex items-center gap-2">
                      <div class="p-1 rounded-full bg-white/30 backdrop-blur-sm">
                        <ClockIcon class="size-3 text-black" />
                      </div>
                      <p class="text-xs font-medium text-black">{{ cls.timeFrom }} - {{ cls.timeTo }}</p>
                    </div>
                    
                    <!-- Group Indicator -->
                    <div class="absolute top-3 right-3">
                      <Avatar class="h-6 w-6 border-2 border-white/50">
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-white/30 backdrop-blur-sm font-bold text-black text-xs">
                          {{ cls.classGroup }}
                        </div>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <!-- Empty State -->
              <div v-else class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
                <div class="max-w-md mx-auto">
                  <div class="text-primary/30 mb-4">
                    <SchoolIcon class="size-12 mx-auto" />
                  </div>
                  <p class="text-gray-500 mb-3">You haven't created any classes yet</p>
                  <p class="text-gray-400 text-sm mb-5">Start by creating your first class</p>
                  <Button 
                    @click="isAddSheetOpen = true" 
                    class="rounded-full px-5"
                  >
                    <PlusCircleIcon class="size-4 mr-2" />
                    Create Class
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <!-- Joined Classes Tab Content -->
        <TabsContent value="joinedClasses" class="mt-0">
          <div class="flex flex-col gap-5">
            <!-- Loading State -->
            <div class="flex flex-1 items-center justify-center py-12" v-if="isLoading">
              <div class="flex flex-col items-center gap-4">
                <IonSpinner class="size-12 text-primary" />
                <p class="text-gray-500 text-sm animate-pulse">Loading joined classes...</p>
              </div>
            </div>

            <!-- Classes List -->
            <div v-else>
              <div v-if="joinedClasses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- Card component for each joined class -->
                <Card 
                  v-for="cls in joinedClasses" 
                  :key="cls.id" 
                  class="relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-none"
                  @click="router.push(`/class/details/${cls.id}`)"
                >
                  <!-- Background with overlay -->
                  <div v-if="cls.class_img" class="absolute inset-0">
                    <img 
                      :src="cls.class_img" 
                      :alt="cls.className" 
                      class="w-full h-full object-cover" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:opacity-90 transition-opacity"></div>
                  </div>
                  <!-- Default background if no image -->
                  <div v-else class="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/50"></div>
                  
                  <CardContent class="flex flex-col p-4 relative z-10 h-[140px]">
                    <div class="bg-white/30 text-[10px] font-medium py-0.5 px-2 rounded-full w-fit mb-2 backdrop-blur-sm">
                      <span class="text-black">{{ cls.classCode }}</span>
                    </div>
                    <h3 class="text-base font-bold text-black line-clamp-2">{{ cls.className }}</h3>
                    <div class="mt-auto flex items-center gap-2">
                      <div class="p-1 rounded-full bg-white/30 backdrop-blur-sm">
                        <ClockIcon class="size-3 text-black" />
                      </div>
                      <p class="text-xs font-medium text-black">{{ cls.timeFrom }} - {{ cls.timeTo }}</p>
                    </div>
                    
                    <!-- Group Indicator -->
                    <div class="absolute top-3 right-3">
                      <Avatar class="h-6 w-6 border-2 border-white/50">
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-white/30 backdrop-blur-sm font-bold text-black text-xs">
                          {{ cls.classGroup }}
                        </div>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <!-- Empty State -->
              <div v-else class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
                <div class="max-w-md mx-auto">
                  <div class="text-primary/30 mb-4">
                    <UsersIcon class="size-12 mx-auto" />
                  </div>
                  <p class="text-gray-500 mb-3">You haven't joined any classes yet</p>
                  <p class="text-gray-400 text-sm mb-5">Join a class with a class code or invitation</p>
                  <Button 
                    @click="isJoinSheetOpen = true" 
                    class="rounded-full px-5"
                  >
                    <UsersIcon class="size-4 mr-2" />
                    Join Class
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <!-- Action Button - Mobile Friendly -->
      <Button 
        class="mt-2 w-full py-5 text-base font-medium bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 group transition-all duration-300 sm:hidden" 
        @click="isAddSheetOpen = true"
      >
        <div class="relative flex items-center justify-center">
          <span class="text-black font-semibold">Create New Class</span>
          <PlusCircleIcon class="ml-2 text-black group-hover:scale-110 transition-transform" />
        </div>
      </Button>

      <!-- Modals -->
      <NewClassSheet v-model:open="isAddSheetOpen" />
      <JoinClassSheet v-model:open="isJoinSheetOpen" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PlusCircleIcon, UsersIcon, SchoolIcon, ClockIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import NewClassSheet from "@/components/NewClassSheet.vue";
import { onMounted, ref } from "vue";
import { useClassStore } from "@/stores/classStore";
import { storeToRefs } from "pinia";
import { IonSpinner } from "@ionic/vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JoinClassSheet from "@/components/JoinClassSheet.vue";
import { useRouter } from "vue-router";

const isAddSheetOpen = ref(false);
const isJoinSheetOpen = ref(false);
const classStore = useClassStore();
const { classes, joinedClasses } = storeToRefs(classStore);
const isLoading = ref(true);
const router = useRouter();

onMounted(async () => {
  await classStore.getClasses();
  await classStore.getJoinedClasses();
  isLoading.value = false;
});
</script>

<style scoped>
/* Card hover animation */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

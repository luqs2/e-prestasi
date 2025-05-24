<template>
  <!-- Main container for the report page -->
  <PageContainer>
    <!-- Page header with title and description -->
    <div class="flex flex-col gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-6">
      <div>
        <h1 class="text-3xl font-bold text-black">Reports</h1>
        <p class="text-lg text-gray-600 mt-1">Track your performance and progress</p>
      </div>
    </div>

    <!-- Tabs for different report types -->
    <Tabs default-value="myClassesReports" class="flex flex-col gap-6">
      <!-- Redesigned tab navigation -->
      <TabsList class="w-full bg-gray-50 p-1 rounded-xl">
        <TabsTrigger value="myClassesReports" class="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1">
            <School class="size-4" />
            <span class="text-xs sm:text-sm">My Classes</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="joinedClassesReports" class="data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-1">
            <Users class="size-4" />
            <span class="text-xs sm:text-sm">Joined Classes</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <!-- My Classes Reports Tab Content -->
      <TabsContent value="myClassesReports" class="mt-0">
        <div class="flex flex-col gap-4">
          <!-- Loading spinner -->
          <div class="flex flex-1 items-center justify-center h-40" v-if="isLoading">
            <div class="flex flex-col items-center gap-4">
              <IonSpinner class="size-12 text-primary" />
              <p class="text-gray-500 text-sm animate-pulse">Loading reports...</p>
            </div>
          </div>

          <template v-else>
            <template v-if="classes.length > 0">
              <!-- Class report cards -->
              <Card v-for="cls in classes" :key="cls.id" class="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                <CardContent class="p-5">
                  <!-- Class header section -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <Avatar class="h-12 w-12 border-2 border-white/50">
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-primary text-black font-bold">
                          {{ cls.classGroup || cls.className[0] }}
                        </div>
                      </Avatar>
                      <div>
                        <div class="bg-white/30 text-[10px] font-medium py-0.5 px-2 rounded-full w-fit mb-1 backdrop-blur-sm">
                          <span class="text-black text-xs">{{ cls.classCode }}</span>
                        </div>
                        <p class="font-bold">{{ cls.className }}</p>
                        <div class="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Clock class="size-3 mr-1" />
                          {{ cls.timeFrom }} - {{ cls.timeTo }}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="rounded-full px-3"
                      @click="router.push(`/report/details/${cls.id}`)"
                    >
                      <ChevronRight class="size-4" />
                    </Button>
                  </div>

                  <!-- Criteria and points grid -->
                  <Card class="bg-gradient-to-r from-primary/90 to-primary/70 text-white rounded-xl overflow-hidden border-none shadow-sm">
                    <CardContent class="p-4">
                      <h3 class="font-semibold text-sm mb-3 text-black">Criteria and Points</h3>
                      
                      <div v-if="classCriterias[cls.id] && classCriterias[cls.id].length > 0" 
  class="grid grid-cols-1 sm:grid-cols-2 gap-2">
  <Card 
    v-for="criteria in classCriterias[cls.id].slice(0, 4)" 
    :key="criteria.id"
    class="bg-white/30 backdrop-blur-sm border-none"
  >
    <CardContent class="p-3 text-black">
      <div class="flex flex-col xs:flex-row items-start xs:items-center xs:justify-between gap-1">
        <div class="font-medium text-sm line-clamp-1">{{ criteria.name }}</div>
        <Badge class="bg-white/50 text-black rounded-full whitespace-nowrap">
          {{ criteria.value }} pts
        </Badge>
      </div>
    </CardContent>
  </Card>
</div>
                      
                      <div v-else class="bg-white/30 rounded-lg py-4 text-center backdrop-blur-sm">
                        <p class="text-sm font-medium text-black">No criteria defined yet</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </template>
            
            <!-- Empty state -->
            <div v-else class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
              <div class="max-w-md mx-auto">
                <div class="text-primary/30 mb-4">
                  <ClipboardList class="size-12 mx-auto" />
                </div>
                <p class="text-gray-500 mb-2">No class reports found</p>
                <p class="text-gray-400 text-sm">Create a class to see reports here</p>
              </div>
            </div>
          </template>
        </div>
      </TabsContent>

      <!-- Joined Classes Reports Tab Content -->
      <TabsContent value="joinedClassesReports" class="mt-0">
        <div class="flex flex-col gap-4">
          <!-- Loading spinner -->
          <div class="flex flex-1 items-center justify-center h-40" v-if="isLoading">
            <div class="flex flex-col items-center gap-4">
              <IonSpinner class="size-12 text-primary" />
              <p class="text-gray-500 text-sm animate-pulse">Loading reports...</p>
            </div>
          </div>

          <template v-else>
            <template v-if="joinedClasses.length > 0">
              <!-- Joined class report cards -->
              <Card v-for="cls in joinedClasses" :key="cls.id" class="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                <CardContent class="p-5">
                  <!-- Class header section -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <Avatar class="h-12 w-12 border-2 border-white/50">
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-amber-300 text-black font-bold">
                          {{ getClassInitials(cls.classGroup || cls.className) }}
                        </div>
                      </Avatar>
                      <div>
                        <div class="bg-white/30 text-[10px] font-medium py-0.5 px-2 rounded-full w-fit mb-1 backdrop-blur-sm">
                          <span class="text-black text-xs">{{ cls.classCode }}</span>
                        </div>
                        <p class="font-bold">{{ cls.className }}</p>
                        <div class="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Clock class="size-3 mr-1" />
                          {{ cls.timeFrom }} - {{ cls.timeTo }}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="rounded-full px-3"
                      @click="router.push(`/report/details/${cls.id}`)"
                    >
                      <ChevronRight class="size-4" />
                    </Button>
                  </div>

                  <!-- Points summary -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <!-- Points card -->
                    <Card class="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all overflow-hidden border-none col-span-1 sm:col-span-3">
                      <CardContent class="p-4">
                        <div class="flex items-center gap-3">
                          <div class="rounded-full bg-amber-100 p-3">
                            <Trophy class="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">My Points</p>
                            <p class="text-2xl font-semibold">{{ cls.points || 0 }} pts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <!-- View details button -->
                  <div class="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      class="rounded-full"
                      @click="router.push(`/report/details/${cls.id}`)"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </template>
            
            <!-- Empty state for joined classes -->
            <div v-else class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
              <div class="max-w-md mx-auto">
                <div class="text-primary/30 mb-4">
                  <Users class="size-12 mx-auto" />
                </div>
                <p class="text-gray-500 mb-2">No joined class reports found</p>
                <p class="text-gray-400 text-sm">Join a class to see reports here</p>
              </div>
            </div>
          </template>
        </div>
      </TabsContent>
    </Tabs>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassStore } from "@/stores/classStore";
import { IonSpinner } from "@ionic/vue";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { 
  Clock, 
  Users, 
  School, 
  ChevronRight,
  ClipboardList,
  Trophy
} from "lucide-vue-next";

const router = useRouter();
const classStore = useClassStore();
const { classes, joinedClasses } = storeToRefs(classStore);
const isLoading = ref(true);
const classCriterias = ref<{ [key: number]: any[] }>({});

function getClassInitials(className: string) {
  return className
    .split(" ")
    .map((word) => word[0])
    .join("");
}

onMounted(async () => {
  try {
    await classStore.getClasses();
    await classStore.getJoinedClasses();
    
    // Fetch criteria for each class
    if (classes.value.length > 0) {
      for (const cls of classes.value) {
        try {
          const criteria = await classStore.getCriterias(cls.id);
          classCriterias.value[cls.id] = criteria;
        } catch (error) {
          console.error(`Error fetching criteria for class ${cls.id}:`, error);
        }
      }
    }
    
  } catch (error) {
    console.error("Error fetching classes:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Card hover animation */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
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

<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <Button
          variant="outline"
          class="border-primary text-primary size-8 aspect-square rounded-full"
          @click="router.back()"
        >
          <ChevronLeftIcon />
        </Button>
        <div class="flex flex-1 flex-col">
          <p class="text-sm font-light">{{ classDetails?.classCode }}</p>
          <p class="font-bold text-sm">{{ classDetails?.className }}</p>
        </div>
        <Avatar>
          <div
            class="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold"
          >
            {{ classDetails?.classGroup }}
          </div>
        </Avatar>
      </div>

      <Card variant="dark">
        <CardContent class="text-primary flex flex-col gap-2">
          <p class="text-sm">Performance Summary</p>

          <div class="grid grid-cols-2 grid-rows-2 gap-4">
            <Card variant="outline" class="p-0">
              <CardContent class="p-2">
                <p>Overall Grade</p>
                <p class="text-2xl">A</p>
              </CardContent>
            </Card>
            <Card variant="outline" class="p-0">
              <CardContent class="p-2">
                <p>Attendance</p>
                <p class="text-2xl">95%</p>
              </CardContent>
            </Card>
            <Card variant="outline" class="p-0">
              <CardContent class="p-2">
                <p>Assignment</p>
                <p class="text-2xl">18/20</p>
              </CardContent>
            </Card>
            <Card variant="outline" class="p-0">
              <CardContent class="p-2">
                <p>Participation</p>
                <p class="text-2xl">Good</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div class="flex flex-col gap-4">
        <p class="font-bold text-sm">Ranking in class</p>

        <div v-if="loading" class="flex justify-center py-4">
          <p>Loading student rankings...</p>
        </div>
        
        <div v-else-if="students.length === 0" class="flex justify-center py-4">
          <p>No students enrolled in this class yet.</p>
        </div>

        <div v-else class="flex flex-col gap-2">
          <Card v-for="(student, index) in sortedStudents" :key="student.profiles.id" class="p-0">
            <CardContent class="flex gap-2 items-center flex-1 p-4">
              <p class="text-primary font-bold text-sm flex">{{ index + 1 }}</p>
              <Avatar class="flex">
                <AvatarImage
                  v-if="student.profiles?.user_avatar"
                  :src="student.profiles.user_avatar"
                  :alt="getStudentName(student.profiles)"
                />
                <AvatarFallback v-if="student.profiles">
                  {{ getInitials(getStudentName(student.profiles)) }}
                </AvatarFallback>
              </Avatar>
              <p class="font-bold text-sm flex flex-1">{{ getStudentName(student.profiles) }}</p>
              <p class="font-bold text-sm flex">{{ student.points }}</p>
            </CardContent>
          </Card>
          
          <Button v-if="students.length > 5 && !showAll" 
                  @click="showAll = true" 
                  variant="link" 
                  class="text-xs text-black underline">
            View complete rankings
          </Button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="font-bold text-sm">Assessment</p>
        <Card>
          <CardContent class="flex flex-col gap-4">
            <div v-if="loadingCriterias" class="flex justify-center py-2">
              <p class="text-sm">Loading criteria...</p>
            </div>
            
            <div v-else-if="criterias.length === 0" class="flex justify-center py-2">
              <p class="text-sm">No criteria have been set for this class yet.</p>
            </div>
            
            <div v-else v-for="criteria in criterias" :key="criteria.id" class="flex flex-col gap-1">
              <p class="text-xs">{{ criteria.name }}</p>
              <div class="flex gap-2 items-center">
                <Progress :model-value="calculatePercentage(criteria.points_awarded, criteria.total_possible)" class="flex-1" />
                <p class="font-bold text-sm">{{ criteria.points_awarded }} / {{ criteria.value * students.value.length }} points</p>
              </div>
              <p class="text-xs text-muted-foreground">{{ criteria.students_awarded }} students awarded</p>
            </div>
            
            <div v-if="criterias.length > 0" class="border-t pt-4 mt-2">
              <p class="text-xs">Total Points Earned</p>
              <div class="flex gap-2 items-center">
                <p class="font-bold text-sm">{{ getTotalPointsAwarded() }} points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { useClassStore } from "@/stores/classStore";
import { ref, computed, onMounted } from "vue";
import { Progress } from "@/components/ui/progress";

const router = useRouter();
const route = useRoute();
const classStore = useClassStore();
const classId = Number(route.params.id);

const classDetails = ref<Class | null>(null);
const students = ref<ClassUser[]>([]);
const loading = ref(true);
const showAll = ref(false);
const criterias = ref<any[]>([]);
const loadingCriterias = ref(true);

// Sort students by points (highest first)
const sortedStudents = computed(() => {
  // If showAll is false, show only top 5 students
  const sorted = [...students.value].sort((a, b) => b.points - a.points);
  return showAll.value ? sorted : sorted.slice(0, 5);
});

// Get initials from full name for avatar fallback
function getInitials(name: string): string {
  if (!name) return "N/A";
  return name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Get student name
function getStudentName(profile: UserProfile | null | undefined): string {
  if (!profile) return 'Unknown Student';
  
  // Check if full_name exists
  if (profile.full_name) return profile.full_name;
  
  // Otherwise combine firstName and lastName
  return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
}

// Calculate percentage
function calculatePercentage(awarded: number, possible: number): number {
  if (possible === 0) return 0;
  return (awarded / possible) * 100;
}

// Get total points awarded
function getTotalPointsAwarded(): number {
  return criterias.value.reduce((total, criteria) => total + criteria.points_awarded, 0);
}

onMounted(async () => {
  try {
    // Load class details
    classDetails.value = await classStore.getClassById(classId);
    
    // Load students in class
    const studentsData = await classStore.getStudentsInClass(classId);
    
    // Transform the data to match the ClassUser interface
    students.value = studentsData.map(student => {
      return {
        points: student.points,
        // If profiles is an array, take the first element
        profiles: Array.isArray(student.profiles) ? student.profiles[0] : student.profiles
      };
    });
    
    console.log("Fetched students:", students.value);
    if (students.value.length > 0) {
      console.log("First student structure:", JSON.stringify(students.value[0], null, 2));
    }

    // Load criteria for this class
    const criteriasData = await classStore.getAllClassCriterias(classId);
    criterias.value = criteriasData.map(criteria => ({
      ...criteria,
      total_possible: criteria.value * students.value.length // Total possible points across all students
    }));
    
    console.log("Fetched criteria:", criterias.value);
    
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    loading.value = false;
    loadingCriterias.value = false;
  }
});
</script>

<style scoped></style>

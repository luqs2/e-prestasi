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
          <Card
            v-for="(student, index) in sortedStudents"
            :key="student.profiles.id"
            class="p-0"
            :class="isCurrentUser(student) ? '!bg-primary/80 ' : ''"
          >
            <CardContent
              class="flex gap-2 items-center flex-1 p-4"
              :class="isCurrentUser(student) ? 'text-black font-bold' : ''"
            >
              <p
                class="text-primary font-bold text-sm flex"
                :class="isCurrentUser(student) ? '!text-black' : ''"
              >
                {{ index + 1 }}
              </p>
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
              <p class="font-bold text-sm flex flex-1">
                {{ getStudentName(student.profiles) }}
                {{ isCurrentUser(student) && "(You)" }}
              </p>
              <p class="font-bold text-sm flex">{{ student.points }}</p>
            </CardContent>
          </Card>

          <Button
            v-if="students.length > 5 && !showAll"
            @click="showAll = true"
            variant="link"
            class="text-xs text-black underline"
          >
            View complete rankings
          </Button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="font-bold text-sm">Points History</p>

        <div v-if="loadingCriterias" class="flex justify-center py-2">
          <p class="text-sm">Loading criteria...</p>
        </div>

        <div
          v-else-if="criterias.length === 0"
          class="flex justify-center py-2"
        >
          <p class="text-sm">No criteria have been set for this class yet.</p>
        </div>

        <div v-if="criterias.length > 0">
          <div class="flex flex-col gap-4">
            <Card
              v-for="(entry, idx) in filteredPointsHistory"
              :key="idx"
              class="p-0"
            >
              <CardContent class="p-2 text-xs">
                {{ formatPointsHistoryEntry(entry) }}
              </CardContent>
            </Card>
          </div>
        </div>
        <div v-else class="text-xs text-muted-foreground">
          No points history yet.
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useClassStore } from "@/stores/classStore";
import { ChevronLeftIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const classStore = useClassStore();
const classId = Number(route.params.id);

const classDetails = ref<ClassWithPoints | null>(null);
const students = ref<ClassUser[]>([]);
const loading = ref(true);
const showAll = ref(false);
const criterias = ref<any[]>([]);
const loadingCriterias = ref(true);
const currentUserId = ref<string | null>(null);

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
  if (!profile) return "Unknown Student";

  // Check if full_name exists
  if (profile.full_name) return profile.full_name;

  // Otherwise combine firstName and lastName
  return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
}

// Calculate percentage
function calculatePercentage(awarded: number, possible: number): number {
  if (possible === 0) return 0;
  return (awarded / possible) * 100;
}

function isCurrentUser(student: any) {
  return student.profiles && student.profiles.id === currentUserId.value;
}

function formatPointsHistoryEntry(entry: string) {
  // Example: "Kehadiran + 2 + 2024-06-07T13:45:30.123Z"
  const [criteria, points, date] = entry.split(" + ");
  const formattedDate = date ? new Date(date).toLocaleString() : "";
  return `${criteria} (+${points}) on ${formattedDate}`;
}

const filteredPointsHistory = computed(() => {
  return Array.isArray(classDetails.value?.pointsHistory)
    ? classDetails.value.pointsHistory.filter(
        (entry) => typeof entry === "string"
      )
    : [];
});

onMounted(async () => {
  try {
    // Get current user ID
    const { data } = await supabase.auth.getSession();
    currentUserId.value = data.session?.user.id || null;

    // Load class details
    classDetails.value = await classStore.getJoinedClassById(classId);

    // Load students in class
    const studentsData = await classStore.getStudentsInClass(classId);

    // Transform the data to match the ClassUser interface
    students.value = studentsData.map((student) => {
      return {
        points: student.points,
        // If profiles is an array, take the first element
        profiles: Array.isArray(student.profiles)
          ? student.profiles[0]
          : student.profiles,
      };
    });

    console.log("Fetched students:", students.value);
    if (students.value.length > 0) {
      console.log(
        "First student structure:",
        JSON.stringify(students.value[0], null, 2)
      );
    }

    // Load criteria for this class
    criterias.value = classDetails.value.pointsHistory;

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

<template>
  <PageContainer>
    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <IonSpinner class="size-12" />
    </div>

    <div v-else-if="classDetails" class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button variant="outline" size="iconsm" @click="router.back()">
          <ChevronLeft class="size-6 text-primary" />
        </Button>
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col">
            <span class="font-light">{{ classDetails.classCode }}</span>
            <span class="font-bold">{{ classDetails.className }}</span>
          </div>
          <div>
            <Avatar>
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold"
              >
                {{ classDetails.classGroup }}
              </div>
            </Avatar>
          </div>
        </div>
      </div>

      <!-- Teacher Controls - Only shown for classes created by the user -->
      <Card
        class="bg-primary text-primary-foreground"
        variant="dark"
        v-if="isUserClass"
      >
        <CardContent class="p-4">
          <div class=" grid grid-cols-2 gap-2">
            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="handleStudentList"
            >
              <Button
                variant="outline"
                size="icon"
                class="bg-secondary"
              >
                <Users2 class="h-6 w-6 text-primary" />
              </Button>
              <span class="text-xs text-primary">Student List</span>
            </div>

            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="handleTasks"
            >
              <Button
                variant="outline"
                size="icon"
                class="bg-secondary"
              >
                <ClipboardList class="h-6 w-6 text-primary" />
              </Button>
              <span class="text-xs text-primary">Add Tasks</span>
            </div>

            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="router.push('/class/evaluation-criteria')"
            >
              <Button
                variant="outline"
                size="icon"
                class="bg-secondary"
              >
                <Award class="h-6 w-6 text-primary" />
              </Button>
              <span class="text-xs text-primary">Evaluation Criteria</span>
            </div>

            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="handleShareClass"
            >
              <Button
                variant="outline"
                size="icon"
                class="bg-secondary"
              >
                <Share2 class="h-6 w-6 text-primary" />
              </Button>
              <span class="text-xs text-primary">Share Class</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Teacher Task List - Only shown for classes created by the user -->
      <div v-if="isUserClass" class="flex flex-col gap-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-xl font-bold">Class Tasks</h2>
          <Button size="sm" variant="outline" class="flex items-center gap-1">
            <PlusCircle class="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>

        <Card
          v-for="task in classTasks"
          :key="task.id"
          class="mb-3 overflow-hidden border-l-4"
          :class="{
            'border-green-500': task.status === 'completed',
            'border-blue-500': task.status === 'in-progress',
            'border-amber-500': task.status === 'pending',
          }"
        >
          <CardContent class="p-5">
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <h3 class="font-semibold text-lg mb-1">{{ task.title }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ task.description }}
                </p>
              </div>
              <div class="flex flex-col items-end">
                <div
                  class="flex items-center text-sm text-muted-foreground mb-2"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span>{{ formatDate(task.dueDate) }}</span>
                </div>
                <div class="flex gap-2">
                  <Button size="icon" variant="ghost" class="h-6 w-6">
                    <Pencil class="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    class="h-6 w-6 text-destructive"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          v-if="classTasks.length === 0"
          class="flex flex-col items-center justify-center py-12 px-4 bg-muted/20 rounded-lg"
        >
          <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
          <p class="text-muted-foreground font-medium">No tasks created yet</p>
          <p class="text-sm text-muted-foreground/70 mt-1 mb-4">
            Create your first task for this class
          </p>
          <Button variant="outline" class="flex items-center gap-2">
            <PlusCircle class="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      <!-- Student View - Tasks list shown for joined students -->
      <div v-if="!isUserClass" class="flex flex-col gap-4">
        <h2 class="text-xl font-bold mb-2">Your Tasks</h2>

        <Card
          v-for="task in classTasks"
          :key="task.id"
          class="mb-3 overflow-hidden border-l-4"
          :class="{
            'border-green-500': task.status === 'completed',
            'border-blue-500': task.status === 'in-progress',
            'border-amber-500': task.status === 'pending',
          }"
        >
          <CardContent class="p-5">
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <h3 class="font-semibold text-lg mb-1">{{ task.title }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ task.description }}
                </p>
              </div>
              <div class="flex flex-col items-end">
                <div
                  class="flex items-center text-sm text-muted-foreground mb-2"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span>{{ formatDate(task.dueDate) }}</span>
                </div>
                <Badge
                  :variant="getStatusVariant(task.status)"
                  class="capitalize"
                >
                  {{ task.status }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div
          v-if="classTasks.length === 0"
          class="flex flex-col items-center justify-center py-12 px-4 bg-muted/20 rounded-lg"
        >
          <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
          <p class="text-muted-foreground font-medium">No tasks assigned yet</p>
          <p class="text-sm text-muted-foreground/70 mt-1">
            Check back later for updates
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-40 gap-4">
      <p class="text-lg font-medium">Class not found</p>
      <Button @click="router.back()">Go Back</Button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Users2,
  ClipboardList,
  Share2,
  CalendarIcon,
  PlusCircle,
  Pencil,
  Trash2,
  Award,
} from "lucide-vue-next";
import { IonSpinner } from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClassStore } from "@/stores/classStore";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const classDetails = ref<Class | null>(null);
const isLoading = ref(true);
const currentUserId = ref<string | null>(null);

// Hardcoded tasks (since we don't have a backend for tasks yet)
const classTasks = ref([
  {
    id: 1,
    title: "Homework 1",
    description: "Complete exercises 1-5 from Chapter 3",
    dueDate: "2025-05-01",
    status: "pending",
  },
  {
    id: 2,
    title: "Group Project",
    description: "Prepare presentation slides for the group project",
    dueDate: "2025-05-15",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Quiz 1",
    description: "Review material from weeks 1-3 for upcoming quiz",
    dueDate: "2025-04-28",
    status: "completed",
  },
  {
    id: 4,
    title: "Research Paper",
    description: "Submit your research paper (5 pages minimum)",
    dueDate: "2025-05-20",
    status: "pending",
  },
]);

// Check if the current user created this class
const isUserClass = computed(() => {
  if (!classDetails.value || !currentUserId.value) return false;
  return classDetails.value.user_id === currentUserId.value;
});

// Handler functions for the teacher controls
const handleStudentList = () => {
  // Navigate to student list or open modal
  console.log("View student list");
};

const handleTasks = () => {
  // Navigate to tasks page or open modal
  console.log("Manage tasks");
};


const handleShareClass = () => {
  // Open share dialog
  console.log("Share class");
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default"; // Or whatever represents green in your system
    case "in-progress":
      return "outline"; // Adjust as needed
    case "pending":
      return "outline"; // Adjust as needed
    default:
      return "outline";
  }
};

onMounted(async () => {
  try {
    // Get current user ID
    const { data } = await supabase.auth.getSession();
    currentUserId.value = data.session?.user.id || null;

    const classId = parseInt(route.params.id as string);
    if (isNaN(classId)) {
      return;
    }

    classDetails.value = await classStore.getClassById(classId);
  } catch (error) {
    console.error("Error fetching class details:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <PageContainer v-bind="$attrs">
    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <IonSpinner class="size-12" />
    </div>

    <div v-else-if="classDetails" class="flex flex-col gap-6">
      <!-- Keep existing header -->
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

      <!-- Replace controls with Tabs -->
      <Tabs
        default-value="overview"
        class="flex flex-col gap-8"
        v-if="isUserClass"
      >
        <TabsList class="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="criteria">Criterias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card class="bg-primary text-primary-foreground" variant="dark">
            <CardContent class="p-4">
              <div class="flex justify-around">
                <!-- Share Class Button -->
                <div
                  class="flex flex-col items-center gap-2 cursor-pointer"
                  @click="handleShareClass"
                >
                  <Button variant="outline" size="icon" class="bg-secondary">
                    <Share2 class="h-6 w-6 text-primary" />
                  </Button>
                  <span class="text-xs text-primary">Share Class</span>
                </div>

                <!-- Add Image Button -->
                <div
                  class="flex flex-col items-center gap-2 cursor-pointer"
                  @click="isImageSelectorOpen = true"
                >
                  <Button variant="outline" size="icon" class="bg-secondary">
                    <ImageIcon class="h-6 w-6 text-primary" />
                  </Button>
                  <span class="text-xs text-primary">Class Image</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Class Background Image (if available) -->
          <Card v-if="classDetails.class_img" class="mt-4 overflow-hidden">
            <CardContent class="p-0">
              <div class="relative">
                <img
                  :src="classDetails.class_img"
                  :alt="classDetails.className"
                  class="w-full aspect-video object-cover"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  class="absolute top-2 right-2 opacity-90 bg-white"
                  @click="isImageSelectorOpen = true"
                >
                  <PencilIcon class="h-4 w-4 mr-1" /> Change
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Add an image button if no image yet -->
          <div
            v-else
            class="flex flex-col items-center justify-center mt-4 p-6 border-2 border-dashed rounded-lg border-muted-foreground/25 cursor-pointer"
            @click="isImageSelectorOpen = true"
          >
            <ImagePlusIcon class="h-12 w-12 text-muted-foreground mb-2" />
            <p class="text-muted-foreground">Add a class background image</p>
            <Button variant="outline" size="sm" class="mt-2"
              >Select Image</Button
            >
          </div>

          <!-- Danger Zone -->
          <div class="mt-8 flex flex-col gap-4">
            <Card class="border-destructive/30">
              <CardContent class="p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-destructive">Danger Zone</h3>
                    <p class="text-sm text-muted-foreground">
                      Actions that can't be undone
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    @click="isDeleteClassDialogOpen = true"
                  >
                    Delete Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <!-- Add your student list content here -->
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-bold">Student List</h2>
            <Card v-for="student in students" :key="student.id">
              <CardContent class="flex justify-between">
                <p>
                  {{ student.profiles.firstName }}
                  {{ student.profiles.lastName }}
                </p>
                <Badge>
                  {{ student.points }}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Tasks Management</h2>
              <Button variant="outline" @click="isAddTaskOpen = true">
                <PlusCircleIcon class="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <!-- Task List -->
            <Card
              v-for="task in sortedTasks"
              :key="task.id"
              class="mb-3 overflow-hidden border-l-4"
              :class="{
                'border-green-500': getTaskStatus(task).status === 'New',
                'border-amber-500':
                  getTaskStatus(task).status === 'Ending Soon',
                'border-gray-400': getTaskStatus(task).status === 'Ended',
                'border-gray-300': getTaskStatus(task).status === 'Active',
                'opacity-60':
                  getTaskStatus(task).status ===
                  'Ended' /* Grey out ended tasks */,
              }"
            >
              <CardContent class="p-5">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1">
                    <h3
                      class="font-semibold text-lg mb-1"
                      :class="{
                        'text-gray-500': getTaskStatus(task).status === 'Ended',
                      }"
                    >
                      {{ task.task_name }}
                    </h3>
                    <p
                      class="text-sm"
                      :class="
                        getTaskStatus(task).status === 'Ended'
                          ? 'text-gray-400'
                          : 'text-muted-foreground'
                      "
                    >
                      {{ task.description }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <div
                      class="flex items-center text-sm text-muted-foreground mb-1"
                    >
                      <CalendarIcon class="h-4 w-4 mr-1" />
                      <span>Due: {{ formatDate(task.end_date) }}</span>
                    </div>

                    <!-- Add created date here -->
                    <div
                      class="flex items-center text-sm text-muted-foreground mb-2"
                    >
                      <Clock class="h-4 w-4 mr-1" />
                      <span
                        >Created: {{ formatDate(task.created_at || "") }}</span
                      >
                    </div>

                    <Badge
                      :class="{
                        'bg-green-500 hover:bg-green-600':
                          getTaskStatus(task).status === 'New',
                        'bg-amber-500 hover:bg-amber-600':
                          getTaskStatus(task).status === 'Ending Soon',
                        'bg-gray-400 hover:bg-gray-500':
                          getTaskStatus(task).status === 'Ended',
                      }"
                    >
                      {{ getTaskStatus(task).status }}
                    </Badge>

                    <!-- Add these buttons -->
                    <div class="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="handleEditTask(task)"
                        title="Edit task"
                      >
                        <PencilIcon class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="confirmDeleteTask(task.id)"
                        title="Delete task"
                      >
                        <TrashIcon class="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Empty state -->
            <div
              v-if="classTasks.length === 0"
              class="flex flex-col items-center justify-center py-12 px-4 bg-muted/20 rounded-lg"
            >
              <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
              <p class="text-muted-foreground font-medium">
                No tasks created yet
              </p>
              <p class="text-sm text-muted-foreground/70 mt-1">
                Add tasks for your students
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="criteria">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Criteria Management</h2>
            </div>

            <div
              v-if="criterias.length === 0"
              class="flex flex-col items-center justify-center py-10 px-4 bg-muted/20 rounded-lg"
            >
              <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
              <p class="text-muted-foreground font-medium">
                No criteria defined yet
              </p>
              <p class="text-sm text-muted-foreground/70 mt-1">
                Add criteria to evaluate student performance
              </p>
            </div>

            <Card
              v-for="criteria in criterias"
              :key="criteria.id"
              class="overflow-hidden"
            >
              <CardContent class="p-4 flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium">{{ criteria.name }}</h3>
                  <p
                    v-if="criteria.description"
                    class="text-sm text-muted-foreground"
                  >
                    {{ criteria.description }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <Badge class="mr-2"> {{ criteria.value || 1 }} points </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="handleScanCriteria(criteria.id)"
                    title="Scan QR to award points"
                  >
                    <QrCodeIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="handleEditCriteria(criteria)"
                    title="Edit criteria"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="confirmDeleteCriteria(criteria.id)"
                    title="Delete criteria"
                  >
                    <TrashIcon class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button
              class="w-full flex items-center justify-center mt-4"
              variant="outline"
              @click="isAddCriteriaOpen = true"
            >
              <PlusCircleIcon class="h-5 w-5 mr-2" />
              <span>Add New Evaluation Criteria</span>
            </Button>

            <AddCriteriaSheet
              v-model:open="isAddCriteriaOpen"
              :classId="classDetails.id"
              :onSuccess="refreshCriterias"
            />

            <EditCriteriaSheet
              v-model:open="isEditCriteriaOpen"
              :classId="classDetails.id"
              :criteria="selectedCriteria || {}"
              :onSuccess="refreshCriterias"
            />
          </div>
        </TabsContent>
      </Tabs>

      <!-- Student View - Keep existing code for non-teacher view -->
      <div v-else class="flex flex-col gap-4">
        <!-- Add this button at the top -->
        <div class="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            class="text-destructive border-destructive/30 hover:bg-destructive/10"
            @click="isLeaveClassDialogOpen = true"
          >
            Leave Class
          </Button>
        </div>

        <h2 class="text-xl font-bold mb-2">Your Tasks</h2>

        <Card
          v-for="task in classTasks"
          :key="task.id"
          class="mb-3 overflow-hidden border-l-4"
          :class="{
            'border-green-500': getTaskStatus(task).status === 'New',
            'border-amber-500': getTaskStatus(task).status === 'Ending Soon',
            'border-red-500': getTaskStatus(task).status === 'Overdue',
            'border-gray-300': getTaskStatus(task).status === 'Active',
          }"
        >
          <CardContent class="p-5">
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <h3 class="font-semibold text-lg mb-1">{{ task.task_name }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ task.description }}
                </p>
              </div>
              <div class="flex flex-col items-end">
                <div
                  class="flex items-center text-sm text-muted-foreground mb-1"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span>Due: {{ formatDate(task.end_date) }}</span>
                </div>

                <!-- Add created date here -->
                <div
                  class="flex items-center text-sm text-muted-foreground mb-2"
                >
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Created: {{ formatDate(task.created_at || "") }}</span>
                </div>

                <Badge
                  :class="{
                    'bg-green-500 hover:bg-green-600':
                      getTaskStatus(task).status === 'New',
                    'bg-amber-500 hover:bg-amber-600':
                      getTaskStatus(task).status === 'Ending Soon',
                    'bg-red-500 hover:bg-red-600':
                      getTaskStatus(task).status === 'Overdue',
                  }"
                >
                  {{ getTaskStatus(task).status }}
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

    <Dialog
      :open="isDeleteDialogOpen"
      @update:open="isDeleteDialogOpen = $event"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span class="text-destructive">Delete Criteria</span>
          </DialogTitle>
          <DialogDescription>
            <span class="text-sm text-secondary">
              Are you sure you want to delete this criteria? This action cannot
              be undone.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div class="flex justify-end space-x-2 pt-4">
          <Button variant="outline" @click="isDeleteDialogOpen = false"
            ><span class="text-secondary">Cancel</span></Button
          >
          <Button variant="destructive" @click="confirmDelete"
            ><span class="text-secondary">Delete</span></Button
          >
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
      :open="isImageSelectorOpen"
      @update:open="isImageSelectorOpen = $event"
    >
      <DialogContent class="max-w-md bg-white text-black">
        <DialogHeader>
          <DialogTitle>Select Class Background</DialogTitle>
          <DialogDescription>
            Choose an image that represents this class.
          </DialogDescription>
        </DialogHeader>

        <ClassImageSelector
          :initialImage="classDetails?.class_img"
          @select="handleImageSelect"
        />

        <DialogFooter class="flex justify-between">
          <Button variant="outline" @click="isImageSelectorOpen = false"
            >Cancel</Button
          >
          <Button
            variant="default"
            @click="isImageSelectorOpen = false"
            :disabled="isUpdatingImage"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add these dialogs -->
    <Dialog
      :open="isDeleteClassDialogOpen"
      @update:open="isDeleteClassDialogOpen = $event"
    >
      <DialogContent class="bg-white text-black">
        <DialogHeader>
          <DialogTitle class="text-destructive">Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this class? This action cannot be
            undone and will remove all student data, tasks, and criteria.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex justify-end space-x-2 pt-4">
          <Button variant="outline" @click="isDeleteClassDialogOpen = false"
            >Cancel</Button
          >
          <Button
            variant="destructive"
            @click="handleDeleteClass"
            :loading="isDeleting"
          >
            Delete Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      :open="isLeaveClassDialogOpen"
      @update:open="isLeaveClassDialogOpen = $event"
    >
      <DialogContent class="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Leave Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this class? You'll lose access to all
            class materials and your progress.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex justify-end space-x-2 pt-4">
          <Button variant="outline" @click="isLeaveClassDialogOpen = false"
            >Cancel</Button
          >
          <Button
            variant="default"
            class="bg-destructive hover:bg-destructive/90 text-white"
            @click="handleLeaveClass"
            :loading="isLeaving"
          >
            Leave Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Task Dialog -->
    <Dialog :open="isAddTaskOpen" @update:open="isAddTaskOpen = $event">
      <DialogContent class="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a task for your students to complete.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          v-if="classDetails"
          :classId="classDetails.id"
          @success="handleAddTask"
          @cancel="isAddTaskOpen = false"
        />
      </DialogContent>
    </Dialog>

    <!-- Edit Task Dialog -->
    <Dialog :open="isEditTaskOpen" @update:open="isEditTaskOpen = $event">
      <DialogContent class="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of this task.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          v-if="classDetails"
          :classId="classDetails.id"
          :task="selectedTask"
          @success="handleUpdateTask"
          @cancel="isEditTaskOpen = false"
        />
      </DialogContent>
    </Dialog>

    <!-- Delete Task Dialog -->
    <Dialog
      :open="isTaskDeleteDialogOpen"
      @update:open="isTaskDeleteDialogOpen = $event"
    >
      <DialogContent class="bg-white text-black">
        <DialogHeader>
          <DialogTitle class="text-destructive">Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex justify-end space-x-2 pt-4">
          <Button variant="outline" @click="isTaskDeleteDialogOpen = false"
            >Cancel</Button
          >
          <Button variant="destructive" @click="handleDeleteTask">
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import AddCriteriaSheet from "@/components/AddCriteriaSheet.vue";
import EditCriteriaSheet from "@/components/EditCriteriaSheet.vue";
import PageContainer from "@/components/PageContainer.vue";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useClassStore } from "@/stores/classStore";
import { IonSpinner } from "@ionic/vue";
import {
  CalendarIcon,
  ChevronLeft,
  ClipboardList,
  PlusCircleIcon,
  QrCodeIcon,
  Share2,
  TrashIcon,
  PencilIcon,
  ImageIcon,
  ImagePlusIcon,
  Clock,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClassImageSelector from "@/components/ClassImageSelector.vue";
import { toast } from "vue-sonner"; // Add at the top of your imports
import { useTaskStore } from "@/stores/taskStore";
import { storeToRefs } from "pinia";
import TaskForm from "@/components/TaskForm.vue";

defineOptions({
  inheritAttrs: false,
});

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const classDetails = ref<Class | null>(null);
const isLoading = ref(true);
const currentUserId = ref<string | null>(null);
const students = ref<any[]>([]);
const criterias = ref<any[]>([]);
const isAddCriteriaOpen = ref(false);
const isEditCriteriaOpen = ref(false);
const selectedCriteria = ref<Record<string, any> | null>(null);
const isScanning = ref(false);
const scanError = ref<string | null>(null);
const isDeleteDialogOpen = ref(false);
const criteriaToDelete = ref<number | null>(null);
const isImageSelectorOpen = ref(false);
const isUpdatingImage = ref(false);
const isLeaveClassDialogOpen = ref(false);
const isDeleteClassDialogOpen = ref(false);
const isDeleting = ref(false);
const isLeaving = ref(false);
const isAddTaskOpen = ref(false);
const taskStore = useTaskStore();
const { classTasks } = storeToRefs(taskStore);
const isEditTaskOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const isTaskDeleteDialogOpen = ref(false);
const taskToDelete = ref<number | null>(null);

// Check if the current user created this class
const isUserClass = computed(() => {
  if (!classDetails.value || !currentUserId.value) return false;
  return classDetails.value.user_id === currentUserId.value;
});

// Add this after your existing computed properties
const sortedTasks = computed(() => {
  if (!classTasks.value) return [];

  return [...classTasks.value].sort((a, b) => {
    const aStatus = getTaskStatus(a).status;
    const bStatus = getTaskStatus(b).status;

    // Sort "Ended" tasks to the bottom
    if (aStatus === "Ended" && bStatus !== "Ended") return 1;
    if (aStatus !== "Ended" && bStatus === "Ended") return -1;

    // For non-ended tasks, sort by due date (most urgent first)
    return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
  });
});

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

const getTaskStatus = (task: Task) => {
  const today = new Date();
  const endDate = new Date(task.end_date);
  const createdDate = task.created_at ? new Date(task.created_at) : null;

  // Task is ending soon if due in 3 days or less
  const daysUntilDue = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 0) {
    return { status: "Overdue", variant: "destructive" };
  } else if (daysUntilDue <= 3) {
    return { status: "Ending Soon", variant: "warning" };
  } else if (
    createdDate &&
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24) <= 3
  ) {
    return { status: "New", variant: "default" };
  } else {
    return { status: "Active", variant: "outline" };
  }
};

const refreshCriterias = async () => {
  if (classDetails.value) {
    criterias.value = await classStore.getCriterias(classDetails.value.id);
  }
};

async function refreshTasks() {
  if (classDetails.value) {
    await taskStore.getTasksByClassId(classDetails.value.id);
  }
}

async function handleAddTask(taskData: Partial<Task>) {
  try {
    await taskStore.addTask(taskData);
    isAddTaskOpen.value = false;
    refreshTasks();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

async function handleUpdateTask(taskData: Partial<Task>) {
  if (!selectedTask.value) return;

  try {
    await taskStore.updateTask(selectedTask.value.id, taskData);
    isEditTaskOpen.value = false;
    refreshTasks();
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

function handleEditTask(task: Task) {
  selectedTask.value = task;
  isEditTaskOpen.value = true;
}

function confirmDeleteTask(taskId: number) {
  taskToDelete.value = taskId;
  isTaskDeleteDialogOpen.value = true;
}

async function handleDeleteTask() {
  if (!taskToDelete.value) return;

  try {
    await taskStore.deleteTask(taskToDelete.value);
    isTaskDeleteDialogOpen.value = false;
    refreshTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

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

    if (classDetails.value) {
      students.value = await classStore.getStudentsInClass(
        classDetails.value?.id
      );
      criterias.value = await classStore.getCriterias(classDetails.value?.id);
      await taskStore.getTasksByClassId(classDetails.value.id);
    }
  } catch (error) {
    console.error("Error fetching class details:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleRemoveCriteria = async (criteriaId: number) => {
  await classStore.removeCriteria(classDetails.value?.id as number, criteriaId);
  refreshCriterias();
};

const confirmDeleteCriteria = (criteriaId: number) => {
  criteriaToDelete.value = criteriaId;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = async () => {
  if (criteriaToDelete.value) {
    await handleRemoveCriteria(criteriaToDelete.value);
    isDeleteDialogOpen.value = false;
    criteriaToDelete.value = null;
  }
};

const handleEditCriteria = (criteria: Record<string, any>) => {
  selectedCriteria.value = criteria;
  isEditCriteriaOpen.value = true;
};

const handleScanCriteria = async (criteriaId: number) => {
  console.log("Scanning criteria with ID:", criteriaId);
  try {
    // Prepare UI for scanning
    isScanning.value = true;
    document.querySelector("body")?.classList.add("scanner-active");

    // Start scanning
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
    });

    if (result.ScanResult) {
      console.log("Scanned content:", result.ScanResult);
      // Handle the scanned QR code content here
      // You might want to validate the content or process it further

      //After scanning, get userid from the scanned QR code and award points
      const res = await supabase
        .from("profiles")
        .select("user_id")
        .eq("qr_id", result.ScanResult)
        .single();

      if (res.data)
        await classStore.awardPoints(
          classDetails.value?.id as number,
          res.data.user_id,
          criteriaId
        );

      // Refresh the student list after updating points
      if (classDetails.value) {
        students.value = await classStore.getStudentsInClass(
          classDetails.value.id
        );
      }
    }
  } catch (error) {
    console.error("Scanning failed:", error);
    scanError.value =
      error instanceof Error ? error.message : "Failed to scan QR code";
  } finally {
    // Cleanup
    isScanning.value = false;
    document.querySelector("body")?.classList.remove("scanner-active");
  }
};

async function handleImageSelect(image: any) {
  if (!classDetails.value?.id) return;

  try {
    isUpdatingImage.value = true;
    const success = await classStore.uploadClassImage(
      image.largeImageURL,
      classDetails.value.id
    );

    if (success) {
      // Refresh class details to show the new image
      classDetails.value = await classStore.getClassById(classDetails.value.id);
      isImageSelectorOpen.value = false;
    }
  } catch (error) {
    console.error("Error updating class image:", error);
  } finally {
    isUpdatingImage.value = false;
  }
}

async function handleDeleteClass() {
  if (!classDetails.value?.id) return;

  try {
    isDeleting.value = true;
    const success = await classStore.deleteClass(classDetails.value.id);

    if (success) {
      toast.success("Class deleted successfully");
      router.push("/class");
    } else {
      toast.error("Failed to delete class");
    }
  } catch (error) {
    console.error("Error deleting class:", error);
    toast.error("An error occurred while deleting the class");
  } finally {
    isDeleting.value = false;
    isDeleteClassDialogOpen.value = false;
  }
}

async function handleLeaveClass() {
  if (!classDetails.value?.id) return;

  try {
    isLeaving.value = true;
    const success = await classStore.leaveClass(classDetails.value.id);

    if (success) {
      toast.success("You have left the class");
      router.push("/class");
    } else {
      toast.error("Failed to leave class");
    }
  } catch (error) {
    console.error("Error leaving class:", error);
    toast.error("An error occurred while leaving the class");
  } finally {
    isLeaving.value = false;
    isLeaveClassDialogOpen.value = false;
  }
}
</script>

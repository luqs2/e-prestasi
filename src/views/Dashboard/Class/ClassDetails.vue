<template>
  <!-- Main container for the class details page -->
  <PageContainer v-bind="$attrs">
    <!-- Loading spinner while fetching class data -->
    <div v-if="isLoading" class="flex items-center justify-center h-40">
      <IonSpinner class="size-12" />
    </div>

    <!-- Main content when class details are loaded -->
    <div v-else-if="classDetails" class="flex flex-col gap-6">
      <!-- Class header with back button and basic info -->
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

      <!-- Teacher view tabs for class management -->
      <Tabs
        default-value="overview"
        class="flex flex-col gap-8"
        v-if="isUserClass"
      >
        <!-- Tab navigation -->
        <TabsList class="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="criteria">Criterias</TabsTrigger>
        </TabsList>

        <!-- Overview tab content -->
        <TabsContent value="overview">
          <!-- Quick actions card -->
          <Card class="bg-primary text-primary-foreground" variant="dark">
            <CardContent class="p-4">
              <div class="flex justify-around">
                <!-- Share class button -->
                <div
                  class="flex flex-col items-center gap-2 cursor-pointer"
                  @click="handleShareClass"
                >
                  <Button variant="outline" size="icon" class="bg-secondary">
                    <Share2 class="h-6 w-6 text-primary" />
                  </Button>
                  <span class="text-xs text-primary">Share Class</span>
                </div>

                <!-- Add/change class image button -->
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

          <!-- Class background image display -->
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

          <!-- Empty state for class image -->
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

          <!-- Danger zone section for class deletion -->
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

        <!-- Students tab content -->
        <TabsContent value="students">
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-bold">Student List</h2>
            <!-- Student cards with points -->
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

        <!-- Tasks tab content -->
        <TabsContent value="tasks">
          <div class="flex flex-col gap-4">
            <!-- Tasks header with add button -->
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Tasks Management</h2>
              <Button variant="outline" @click="isAddTaskOpen = true">
                <PlusCircleIcon class="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <!-- Task list with status indicators -->
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
                    <!-- Task dates -->
                    <div
                      class="flex items-center text-sm text-muted-foreground mb-1"
                    >
                      <CalendarIcon class="h-4 w-4 mr-1" />
                      <span>Due: {{ formatDate(task.end_date) }}</span>
                    </div>

                    <div
                      class="flex items-center text-sm text-muted-foreground mb-2"
                    >
                      <Clock class="h-4 w-4 mr-1" />
                      <span
                        >Created: {{ formatDate(task.created_at || "") }}</span
                      >
                    </div>

                    <!-- Task status badge -->
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

                    <!-- Task action buttons -->
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

            <!-- Empty state for tasks -->
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

        <!-- Criteria tab content -->
        <TabsContent value="criteria">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Criteria Management</h2>
            </div>

            <!-- Empty state for criteria -->
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

            <!-- Criteria list with actions -->
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
                  <!-- Criteria action buttons -->
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

            <!-- Add new criteria button -->
            <Button
              class="w-full flex items-center justify-center mt-4"
              variant="outline"
              @click="isAddCriteriaOpen = true"
            >
              <PlusCircleIcon class="h-5 w-5 mr-2" />
              <span>Add New Evaluation Criteria</span>
            </Button>

            <!-- Criteria management dialogs -->
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

      <!-- Student view content -->
      <div v-else class="flex flex-col gap-4">
        <!-- Leave class button -->
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

        <!-- Student's task list -->
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
                <!-- Task dates -->
                <div
                  class="flex items-center text-sm text-muted-foreground mb-1"
                >
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  <span>Due: {{ formatDate(task.end_date) }}</span>
                </div>

                <div
                  class="flex items-center text-sm text-muted-foreground mb-2"
                >
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Created: {{ formatDate(task.created_at || "") }}</span>
                </div>

                <!-- Task status badge -->
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

        <!-- Empty state for student tasks -->
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

    <!-- Not found state -->
    <div v-else class="flex flex-col items-center justify-center h-40 gap-4">
      <p class="text-lg font-medium">Class not found</p>
      <Button @click="router.back()">Go Back</Button>
    </div>

    <!-- Various dialogs for different actions -->
    <!-- Delete criteria dialog -->
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

    <!-- Class image selector dialog -->
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

    <!-- Delete class dialog -->
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

    <!-- Leave class dialog -->
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

    <!-- Add task dialog -->
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

    <!-- Edit task dialog -->
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

    <!-- Delete task dialog -->
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

    <!-- Share class dialog with QR code -->
    <Dialog :open="isShareDialogOpen" @update:open="isShareDialogOpen = $event">
      <DialogContent class="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle>Share Class</DialogTitle>
          <DialogDescription>
            Scan this QR code to join the class
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col items-center justify-center py-4">
          <qrcode-svg :value="classDetails?.id.toString()" level="L" />
          <p class="mt-4 text-sm text-muted-foreground">
            Class ID: {{ classDetails?.id }}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isShareDialogOpen = false">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import AddCriteriaSheet from "@/components/AddCriteriaSheet.vue";
import ClassImageSelector from "@/components/ClassImageSelector.vue";
import EditCriteriaSheet from "@/components/EditCriteriaSheet.vue";
import PageContainer from "@/components/PageContainer.vue";
import TaskForm from "@/components/TaskForm.vue";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useClassStore } from "@/stores/classStore";
import { useTaskStore } from "@/stores/taskStore";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";
import { IonSpinner } from "@ionic/vue";
import {
  CalendarIcon,
  ChevronLeft,
  ClipboardList,
  Clock,
  ImageIcon,
  ImagePlusIcon,
  PencilIcon,
  PlusCircleIcon,
  QrCodeIcon,
  Share2,
  TrashIcon,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { QrcodeSvg } from "qrcode.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

// Disable attribute inheritance to prevent unwanted prop passing
defineOptions({
  inheritAttrs: false,
});

// Router and store initialization
const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const taskStore = useTaskStore();

// Reactive state variables
const classDetails = ref<Class | null>(null);
const isLoading = ref(true);
const currentUserId = ref<string | null>(null);
const students = ref<any[]>([]);
const criterias = ref<any[]>([]);

// Dialog state management
const isAddCriteriaOpen = ref(false);
const isEditCriteriaOpen = ref(false);
const selectedCriteria = ref<Record<string, any> | null>(null);
const isScanning = ref(false);
const isDeleteDialogOpen = ref(false);
const criteriaToDelete = ref<number | null>(null);
const isImageSelectorOpen = ref(false);
const isUpdatingImage = ref(false);
const isLeaveClassDialogOpen = ref(false);
const isDeleteClassDialogOpen = ref(false);
const isDeleting = ref(false);
const isLeaving = ref(false);
const isAddTaskOpen = ref(false);
const isEditTaskOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const isTaskDeleteDialogOpen = ref(false);
const taskToDelete = ref<number | null>(null);
const isShareDialogOpen = ref(false);

// QR Scanner state management
const isContinuousScanning = ref(false);
const scannedCodes = ref<Set<string>>(new Set());
const lastScannedStudent = ref<{
  user_id: string;
  firstName: string;
  lastName: string;
} | null>(null);
const isScannedSameStudent = ref(false);

// Store refs
const { classTasks } = storeToRefs(taskStore);

// Computed property to check if current user is the class creator
const isUserClass = computed(() => {
  if (!classDetails.value || !currentUserId.value) return false;
  return classDetails.value.user_id === currentUserId.value;
});

// Computed property to sort tasks by status and due date
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

// Function to handle class sharing
const handleShareClass = () => {
  isShareDialogOpen.value = true;
};

// Utility function to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Function to determine task status based on dates
const getTaskStatus = (task: Task) => {
  const today = new Date();
  const endDate = new Date(task.end_date);
  const createdDate = task.created_at ? new Date(task.created_at) : null;

  // Calculate days until due
  const daysUntilDue = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Return appropriate status based on timing
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

// Function to refresh criteria list
const refreshCriterias = async () => {
  if (classDetails.value) {
    criterias.value = await classStore.getCriterias(classDetails.value.id);
  }
};

// Function to refresh task list
async function refreshTasks() {
  if (classDetails.value) {
    await taskStore.getTasksByClassId(classDetails.value.id);
  }
}

// Task management functions
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

// Component lifecycle hooks
onMounted(async () => {
  try {
    // Get current user ID
    const { data } = await supabase.auth.getSession();
    currentUserId.value = data.session?.user.id || null;

    const classId = parseInt(route.params.id as string);
    if (isNaN(classId)) {
      return;
    }

    // Fetch class details and related data
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

// Criteria management functions
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

// QR Scanner functions
const startContinuousScanning = async (criteriaId: number) => {
  try {
    // Initialize scanner state
    isContinuousScanning.value = true;
    isScanning.value = true;
    document.querySelector("body")?.classList.add("scanner-active");
    scannedCodes.value.clear();
    lastScannedStudent.value = null;
    isScannedSameStudent.value = false;

    // Main scanning loop
    while (isContinuousScanning.value) {
      try {
        // Configure scanner with appropriate instructions
        const result = await CapacitorBarcodeScanner.scanBarcode({
          hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
          scanInstructions:
            lastScannedStudent.value && !isScannedSameStudent.value
              ? `Successfully awarded points to student ${lastScannedStudent.value?.firstName} ${lastScannedStudent.value?.lastName}\nScan the QR code of the next student to award points`
              : isScannedSameStudent.value && lastScannedStudent.value
              ? `Student ${lastScannedStudent.value?.firstName} ${lastScannedStudent.value?.lastName} has already been scanned in this session.\nScan the QR code of the next student to award points`
              : "Scan the QR code of the student to award points",
        });

        if (result.ScanResult) {
          const qrCode = result.ScanResult;

          // Check if student has already been scanned
          if (!scannedCodes.value.has(qrCode)) {
            scannedCodes.value.add(qrCode);

            try {
              // Get student information from database
              const res = await supabase
                .from("profiles")
                .select("user_id, firstName, lastName")
                .eq("qr_id", qrCode)
                .single();

              if (res.data) {
                // Award points to student
                await classStore.awardPoints(
                  classDetails.value?.id as number,
                  res.data.user_id,
                  criteriaId
                );

                // Update last scanned student
                lastScannedStudent.value = res.data;

                // Show success message
                toast.success(
                  `Points awarded to ${res.data.firstName} ${res.data.lastName}.`
                );
              }
            } catch (error) {
              console.error("Error processing QR code:", error);
              toast.error(`Failed to process QR code: ${qrCode}`);
            }
          } else {
            // Handle already scanned student
            toast.info("This student has already been scanned in this session");
            isScannedSameStudent.value = true;
          }
        }
      } catch (error) {
        // Handle user cancellation
        if (
          error instanceof Error &&
          (error.message.includes("User cancelled") ||
            error.message.includes("canceled") ||
            error.message.includes("cancelled"))
        ) {
          isContinuousScanning.value = false;
          break;
        }
        console.error("Scanning error:", error);
        toast.error("Failed to scan QR code");
      }
    }
  } catch (error) {
    console.error("Error in continuous scanning:", error);
    toast.error("Failed to start scanning");
  } finally {
    stopContinuousScanning();
  }
};

// Function to stop scanning and clean up
const stopContinuousScanning = () => {
  isContinuousScanning.value = false;
  isScanning.value = false;
  document.querySelector("body")?.classList.remove("scanner-active");
  lastScannedStudent.value = null;

  // Refresh student list
  if (classDetails.value) {
    classStore.getStudentsInClass(classDetails.value.id).then((result) => {
      students.value = result;
    });
  }
};

// Function to handle criteria scanning
const handleScanCriteria = async (criteriaId: number) => {
  if (isContinuousScanning.value) {
    stopContinuousScanning();
    return;
  }

  startContinuousScanning(criteriaId);
};

// Cleanup on component unmount
onUnmounted(() => {
  stopContinuousScanning();
});

// Image management functions
async function handleImageSelect(image: any) {
  if (!classDetails.value?.id) return;

  try {
    isUpdatingImage.value = true;
    const success = await classStore.uploadClassImage(
      image.largeImageURL,
      classDetails.value.id
    );

    if (success) {
      // Refresh class details to show new image
      classDetails.value = await classStore.getClassById(classDetails.value.id);
      isImageSelectorOpen.value = false;
    }
  } catch (error) {
    console.error("Error updating class image:", error);
  } finally {
    isUpdatingImage.value = false;
  }
}

// Class management functions
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

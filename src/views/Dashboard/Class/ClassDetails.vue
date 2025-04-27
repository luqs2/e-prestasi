<template>
  <PageContainer>
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
                <div
                  class="flex flex-col items-center gap-2 cursor-pointer"
                  @click="handleShareClass"
                >
                  <Button variant="outline" size="icon" class="bg-secondary">
                    <Share2 class="h-6 w-6 text-primary" />
                  </Button>
                  <span class="text-xs text-primary">Share Class</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <!-- Add your tasks management content here -->
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-bold">Tasks Management</h2>
            <!-- Add tasks management component -->
          </div>
        </TabsContent>

        <TabsContent value="criteria">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Criteria Management</h2>
            </div>

            <div v-if="criterias.length === 0" class="flex flex-col items-center justify-center py-10 px-4 bg-muted/20 rounded-lg">
              <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
              <p class="text-muted-foreground font-medium">No criteria defined yet</p>
              <p class="text-sm text-muted-foreground/70 mt-1">
                Add criteria to evaluate student performance
              </p>
            </div>

            <Card v-for="criteria in criterias" :key="criteria.id" class="overflow-hidden">
              <CardContent class="p-4 flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium">{{ criteria.name }}</h3>
                  <p v-if="criteria.description" class="text-sm text-muted-foreground">
                    {{ criteria.description }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <Badge class="mr-2">
                    {{ criteria.value || 1 }} points
                  </Badge>
                  <Button variant="ghost" size="sm" @click="handleScanCriteria(criteria.id)" title="Scan QR to award points">
                    <QrCodeIcon class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="handleEditCriteria(criteria)" title="Edit criteria">
                    <PencilIcon class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="confirmDeleteCriteria(criteria.id)" title="Delete criteria">
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

  <Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <span class="text-destructive">Delete Criteria</span>
          </DialogTitle>
        <DialogDescription>
          <span class="text-sm text-secondary">
            Are you sure you want to delete this criteria? This action cannot be undone.
          </span>
        </DialogDescription>
      </DialogHeader>
      <div class="flex justify-end space-x-2 pt-4">
        <Button variant="outline" @click="isDeleteDialogOpen = false"><span class="text-secondary">Cancel</span></Button>
        <Button variant="destructive" @click="confirmDelete"><span class="text-secondary">Delete</span></Button>
      </div>
    </DialogContent>
  </Dialog>
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const refreshCriterias = async () => {
  if (classDetails.value) {
    criterias.value = await classStore.getCriterias(classDetails.value.id);
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

    if (classDetails.value) {
      students.value = await classStore.getStudentsInClass(
        classDetails.value?.id
      );
      criterias.value = await classStore.getCriterias(classDetails.value?.id);
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
</script>

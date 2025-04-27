<template>
  <PageContainer>
    <div class="flex gap-2 items-center pb-6">
      <Button
        variant="outline"
        class="border-primary text-primary size-8 aspect-square rounded-full"
        @click="router.back()"
      >
        <ChevronLeftIcon />
      </Button>
      <p class="font-bold text-sm">Evaluation Criteria</p>
    </div>

    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h4 class="text-sm font-bold">Criteria</h4>
          <p class="text-sm font-light">The criteria used to evaluate the students in this class.</p>
        </div>
        <Button size="sm" variant="outline" class="flex items-center gap-1" @click="openAddCriteriaDrawer">
          <PlusCircle class="h-4 w-4" />
          <span>Add Criteria</span>
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="criteriaStore.isLoading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="mt-2 text-sm text-muted-foreground">Loading criteria...</p>
      </div>
    </div>

    <!-- Display existing criteria -->
    <div v-else class="space-y-4">
      <Card v-for="criterion in criteriaStore.criteria" :key="criterion.id" class="overflow-hidden">
        <CardContent class="p-5">
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <h3 class="font-semibold text-lg mb-1">{{ criterion.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ criterion.description }}</p>
            </div>
            <div class="flex gap-2">
              <Button size="icon" variant="ghost" class="h-8 w-8" @click="editCriterion(criterion)">
                <Pencil class="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" class="h-8 w-8 text-destructive" @click="deleteCriterion(criterion.id)">
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Empty state when no criteria exist -->
      <div v-if="criteriaStore.criteria.length === 0" class="flex flex-col items-center justify-center py-12 px-4 bg-muted/20 rounded-lg">
        <ClipboardList class="h-14 w-14 text-muted-foreground mb-3" />
        <p class="text-muted-foreground font-medium">No evaluation criteria defined</p>
        <p class="text-sm text-muted-foreground/70 mt-1 mb-4">
          Create your first evaluation criterion for this class
        </p>
        <Button variant="outline" class="flex items-center gap-2" @click="openAddCriteriaDrawer">
          <PlusCircle class="h-4 w-4" />
          <span>Add Criterion</span>
        </Button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="criteriaStore.error" class="mt-4 p-4 rounded-md bg-destructive/10 text-destructive">
      <p>{{ criteriaStore.error }}</p>
    </div>

    <!-- Bottom sheet for adding/editing criteria -->
    <BottomSheet v-model:open="isBottomSheetOpen">
      <div class="px-2 py-3">
        <h3 class="text-lg font-semibold mb-3">{{ isEditing ? 'Edit Criterion' : 'Add New Criterion' }}</h3>
        
        <form @submit.prevent="saveCriterion" class="space-y-6">
          <div class="space-y-2">
            <Label for="criterion-name">Criterion Name</Label>
            <Input id="criterion-name" v-model="newCriterion.name" placeholder="e.g., Class Participation" required />
          </div>
          
          <div class="space-y-2">
            <Label for="criterion-description">Description</Label>
            <Input 
              id="criterion-description" 
              v-model="newCriterion.description" 
              placeholder="Describe how students will be evaluated for this criterion"
            />
          </div>
          
          <div class="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" @click="isBottomSheetOpen = false">Cancel</Button>
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin mr-2" />
              {{ isEditing ? 'Update' : 'Add' }} Criterion
            </Button>
          </div>
        </form>
      </div>
    </BottomSheet>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PageContainer from "@/components/PageContainer.vue";
import { Button } from "@/components/ui/button";
import { useRouter, useRoute } from "vue-router";
import { 
  ChevronLeftIcon, 
  PlusCircle, 
  ClipboardList, 
  Pencil, 
  Trash2,
  Loader2
} from "lucide-vue-next";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BottomSheet from "@/components/BottomSheet.vue";
import { useCriteriaStore } from "@/stores/criteriaStore";
import { Criterion, NewCriterion } from "@/types/criteria";

const router = useRouter();
const route = useRoute();
const criteriaStore = useCriteriaStore();

// Get the class ID from the route parameters
const classId = parseInt(route.params.id as string);

// State for bottom sheet and form
const isBottomSheetOpen = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const editId = ref<number | undefined>(undefined);
const newCriterion = reactive<NewCriterion>({
  name: "",
  description: "",
  class_id: classId
});

// Fetch criteria when the component is mounted
onMounted(async () => {
  if (!isNaN(classId)) {
    await criteriaStore.getCriteriaByClassId(classId);
  }
});

// Open bottom sheet for adding new criteria
const openAddCriteriaDrawer = () => {
  isEditing.value = false;
  resetForm();
  isBottomSheetOpen.value = true;
};

// Edit existing criterion
const editCriterion = (criterion: Criterion) => {
  isEditing.value = true;
  editId.value = criterion.id;
  
  // Copy values to form
  newCriterion.name = criterion.name;
  newCriterion.description = criterion.description;
  
  isBottomSheetOpen.value = true;
};

// Delete criterion
const deleteCriterion = async (id?: number) => {
  if (!id) return;
  
  // In a real app, you might want to add a confirmation dialog here
  await criteriaStore.deleteCriterion(id);
};

// Save criterion (add new or update existing)
const saveCriterion = async () => {
  isSubmitting.value = true;
  
  try {
    if (isEditing.value && editId.value) {
      // Update existing criterion
      await criteriaStore.updateCriterion(editId.value, {
        name: newCriterion.name,
        description: newCriterion.description
      });
    } else {
      // Add new criterion
      await criteriaStore.addCriterion({
        name: newCriterion.name,
        description: newCriterion.description,
        class_id: classId
      });
    }
    
    resetForm();
    isBottomSheetOpen.value = false;
  } catch (error) {
    console.error("Error saving criterion:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form values
const resetForm = () => {
  newCriterion.name = "";
  newCriterion.description = "";
  editId.value = undefined;
};
</script>
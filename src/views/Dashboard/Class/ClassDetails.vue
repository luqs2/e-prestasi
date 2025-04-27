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
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-vue-next";
import { IonSpinner } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClassStore } from "@/stores/classStore";
import { Avatar } from "@/components/ui/avatar";

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const classDetails = ref<Class | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
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

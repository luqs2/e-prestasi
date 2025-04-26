<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <p class="text-sm font-bold">My Classes</p>

      <div class="flex flex-1 items-center justify-center" v-if="isLoading">
        <IonSpinner class="size-12" />
      </div>

      <template v-else>
        <Card v-for="cls in classes" :key="cls.id">
          <CardContent class="flex items-center p-4">
            <div class="flex flex-1 flex-col gap-1">
              <p class="text-xs font-medium">{{ cls.classCode }}</p>
              <p class="text-sm font-bold">{{ cls.className }}</p>
              <p class="text-xs font-light">
                {{ cls.timeFrom }} - {{ cls.timeTo }}
              </p>
            </div>

            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        <Button @click="isSheetOpen = true"><PlusCircleIcon />Add Class</Button>

        <NewClassSheet v-model:open="isSheetOpen" />
      </template>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircleIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import NewClassSheet from "@/components/NewClassSheet.vue";
import { onMounted, ref } from "vue";
import { useClassStore } from "@/stores/classStore";
import { storeToRefs } from "pinia";
import { IonSpinner } from "@ionic/vue";

const isSheetOpen = ref(false);
const classStore = useClassStore();
const { classes } = storeToRefs(classStore);
const isLoading = ref(true);

onMounted(async () => {
  await classStore.getClasses();
  isLoading.value = false;
});
</script>

<style scoped></style>

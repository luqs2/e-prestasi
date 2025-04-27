<template>
  <PageContainer>
    <Tabs default-value="myClasses" class="flex flex-col gap-8">
      <TabsList class="w-full">
        <TabsTrigger value="myClasses"> My Classes </TabsTrigger>
        <TabsTrigger value="joinedClasses"> Joined Classes </TabsTrigger>
      </TabsList>
      <TabsContent value="myClasses">
        <div class="flex flex-col gap-4">
          <div class="flex flex-1 items-center justify-center" v-if="isLoading">
            <IonSpinner class="size-12" />
          </div>

          <template v-else>
            <template v-if="classes.length > 0">
              <Card
                v-for="cls in classes"
                :key="cls.id"
                @click="router.push(`/class/details/${cls.id}`)"
              >
                <CardContent class="flex items-center p-4">
                  <div class="flex flex-1 flex-col gap-1">
                    <p class="text-xs font-medium">{{ cls.classCode }}</p>
                    <p class="text-sm font-bold">{{ cls.className }}</p>
                    <p class="text-xs font-light">
                      {{ cls.timeFrom }} - {{ cls.timeTo }}
                    </p>
                  </div>

                  <Avatar>
                    <div
                      class="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold"
                    >
                      {{ cls.classGroup }}
                    </div>
                  </Avatar>
                </CardContent>
              </Card>
            </template>
            <template v-else>
              <p class="text-sm font-bold">No Classes Found</p>
            </template>

            <Button @click="isAddSheetOpen = true"
              ><PlusCircleIcon />Add Class</Button
            >

            <NewClassSheet v-model:open="isAddSheetOpen" />
          </template>
        </div>
      </TabsContent>
      <TabsContent value="joinedClasses">
        <div class="flex flex-col gap-4">
          <div class="flex flex-1 items-center justify-center" v-if="isLoading">
            <IonSpinner class="size-12" />
          </div>

          <template v-else>
            <template v-if="joinedClasses.length > 0">
              <Card
                v-for="cls in joinedClasses"
                :key="cls.id"
                @click="router.push(`/class/details/${cls.id}`)"
              >
                <CardContent class="flex items-center p-4">
                  <div class="flex flex-1 flex-col gap-1">
                    <p class="text-xs font-medium">{{ cls.classCode }}</p>
                    <p class="text-sm font-bold">{{ cls.className }}</p>
                    <p class="text-xs font-light">
                      {{ cls.timeFrom }} - {{ cls.timeTo }}
                    </p>
                  </div>

                  <Avatar>
                    <div
                      class="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold"
                    >
                      {{ cls.classGroup }}
                    </div>
                  </Avatar>
                </CardContent>
              </Card>
            </template>
            <template v-else>
              <p class="text-sm font-bold">No Classes Found</p>
            </template>

            <Button @click="isJoinSheetOpen = true"
              ><PlusCircleIcon />Join Class</Button
            >

            <JoinClassSheet v-model:open="isJoinSheetOpen" />
          </template>
        </div>
      </TabsContent>
    </Tabs>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PlusCircleIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import NewClassSheet from "@/components/NewClassSheet.vue";
import { onMounted, ref } from "vue";
import { useClassStore } from "@/stores/classStore";
import { storeToRefs } from "pinia";
import { IonSpinner } from "@ionic/vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JoinClassSheet from "@/components/JoinClassSheet.vue";
import { useRouter } from "vue-router";

const isAddSheetOpen = ref(false);
const isJoinSheetOpen = ref(false);
const classStore = useClassStore();
const { classes, joinedClasses } = storeToRefs(classStore);
const isLoading = ref(true);
const router = useRouter();

onMounted(async () => {
  await classStore.getClasses();
  await classStore.getJoinedClasses();
  isLoading.value = false;
});
</script>

<style scoped></style>

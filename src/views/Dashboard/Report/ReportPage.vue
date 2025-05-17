<template>
  <PageContainer>
    <Tabs default-value="myClassesReports" class="flex flex-col gap-8">
      <TabsList class="w-full">
        <TabsTrigger value="myClassesReports"> My Classes </TabsTrigger>
        <TabsTrigger value="joinedClassesReports"> Joined Classes </TabsTrigger>
      </TabsList>

      <TabsContent value="myClassesReports">
        <div class="flex flex-col gap-4">
          <div class="flex flex-1 items-center justify-center" v-if="isLoading">
            <IonSpinner class="size-12" />
          </div>

          <template v-else>
            <template v-if="classes.length > 0">
              <Card v-for="cls in classes" :key="cls.id" variant="button">
                <CardContent class="flex flex-col gap-4">
                  <div class="flex items-center">
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
                  </div>

                  <Card variant="dark">
                    <CardContent class="text-primary flex flex-col gap-2">
                      <p class="text-sm">Criteria and Points</p>

                      <div
                        v-if="
                          classCriterias[cls.id] &&
                          classCriterias[cls.id].length > 0
                        "
                        :class="{
                          'grid gap-4': true,
                          'grid-cols-1': classCriterias[cls.id].length === 1,
                          'grid-cols-2': classCriterias[cls.id].length >= 2,
                          'grid-rows-1': classCriterias[cls.id].length <= 2,
                          'grid-rows-2': classCriterias[cls.id].length > 2,
                        }"
                      >
                        <Card
                          v-for="criteria in classCriterias[cls.id].slice(0, 4)"
                          :key="criteria.id"
                          variant="outline"
                          class="p-0"
                        >
                          <CardContent class="p-2">
                            <p>{{ criteria.name }}</p>
                            <p class="text-2xl">{{ criteria.value }} pts</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div v-else class="py-3 text-center">
                        <p class="text-sm font-medium text-amber-300">
                          No criteria in this class
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    variant="link"
                    class="text-black text-xs w-fit self-end underline"
                    @click="router.push(`/report/details/${cls.id}`)"
                  >
                    More
                  </Button>
                </CardContent>
              </Card>
            </template>
            <template v-else>
              <p class="text-sm font-bold">No Reports Found</p>
            </template>
          </template>
        </div>
      </TabsContent>

      <TabsContent value="joinedClassesReports">
        <div class="flex flex-col gap-4">
          <div class="flex flex-1 items-center justify-center" v-if="isLoading">
            <IonSpinner class="size-12" />
          </div>

          <template v-else>
            <template v-if="joinedClasses.length > 0">
              <Card v-for="cls in joinedClasses" :key="cls.id" variant="button">
                <CardContent class="flex flex-col gap-4">
                  <div class="flex items-center">
                    <div class="flex flex-1 flex-col gap-1">
                      <p class="text-xs font-medium">{{ cls.classCode }}</p>
                      <p class="text-sm font-bold">{{ cls.className }}</p>
                      <p class="text-xs font-light">
                        {{ cls.timeFrom }} - {{ cls.timeTo }}
                      </p>
                    </div>

                    <Avatar>
                      <div
                        class="flex h-full w-full items-center justify-center rounded-full bg-amber-300 text-black font-medium"
                      >
                        {{ getClassInitials(cls.classGroup || cls.className) }}
                      </div>
                    </Avatar>
                  </div>

                  <Card variant="dark">
                    <CardContent class="text-primary flex flex-col gap-2">
                      <p class="text-sm">My Points</p>
                      <Card variant="outline" class="p-0">
                        <CardContent class="p-2">
                          <p class="text-2xl">{{ cls.points || 0 }} pts</p>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>

                  <Button
                    variant="link"
                    class="text-black text-xs w-fit self-end underline"
                    @click="router.push(`/report/details/${cls.id}`)"
                  >
                    More
                  </Button>
                </CardContent>
              </Card>
            </template>
            <template v-else>
              <p class="text-sm font-bold">No Reports Found</p>
            </template>
          </template>
        </div>
      </TabsContent>
    </Tabs>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassStore } from "@/stores/classStore";
import { IonSpinner } from "@ionic/vue";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const classStore = useClassStore();
const { classes, joinedClasses } = storeToRefs(classStore);
const isLoading = ref(true);
const classCriterias = ref<{ [key: number]: any[] }>({});

function getClassInitials(className: string) {
  return className
    .split(" ")
    .map((word) => word[0])
    .join("");
}

onMounted(async () => {
  try {
    await classStore.getClasses();
    await classStore.getJoinedClasses();
  } catch (error) {
    console.error("Error fetching classes:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>

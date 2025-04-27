<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <Button
          variant="outline"
          class="border-primary text-primary size-8 aspect-square rounded-full"
          @click="router.back()"
        >
          <ChevronLeftIcon />
        </Button>
        <div class="flex flex-1 flex-col">
          <p class="text-sm font-light">Des 3073</p>
          <p class="font-bold text-sm">UI/UX Design</p>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
          <AvatarFallback>CN</AvatarFallback>
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

        <div class="flex flex-col gap-2">
          <Card class="p-0">
            <CardContent class="flex gap-2 items-center flex-1 p-4">
              <p class="text-primary font-bold text-sm flex">1</p>
              <Avatar class="flex">
                <AvatarImage
                  src="https://github.com/unovue.png"
                  alt="@unovue"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p class="font-bold text-sm flex flex-1">Putra</p>
              <Progress :model-value="70" class="w-16" />
              <p class="font-bold text-sm flex">95</p>
            </CardContent>
          </Card>
          <Card class="p-0">
            <CardContent class="flex gap-2 items-center flex-1 p-4">
              <p class="text-primary font-bold text-sm flex">1</p>
              <Avatar class="flex">
                <AvatarImage
                  src="https://github.com/unovue.png"
                  alt="@unovue"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p class="font-bold text-sm flex flex-1">Putra</p>
              <Progress :model-value="70" class="w-16" />
              <p class="font-bold text-sm flex">95</p>
            </CardContent>
          </Card>
          <Card class="p-0">
            <CardContent class="flex gap-2 items-center flex-1 p-4">
              <p class="text-primary font-bold text-sm flex">1</p>
              <Avatar class="flex">
                <AvatarImage
                  src="https://github.com/unovue.png"
                  alt="@unovue"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p class="font-bold text-sm flex flex-1">Putra</p>
              <Progress :model-value="70" class="w-16" />
              <p class="font-bold text-sm flex">95</p>
            </CardContent>
          </Card>
          <Button variant="link" class="text-xs text-black underline">
            View complete rankings
          </Button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="font-bold text-sm">Assessment</p>
        <Card>
          <CardContent>
            <div>
              <p class="text-xs">Class Attendance</p>
              <div class="flex gap-2 items-center">
                <Progress :model-value="95" />
                <p class="font-bold text-sm">95%</p>
              </div>
            </div>
            <div>
              <p class="text-xs">Participation</p>
              <div class="flex gap-2 items-center">
                <Progress :model-value="80" />
                <p class="font-bold text-sm">80%</p>
              </div>
            </div>
            <div>
              <p class="text-xs">Attitude</p>
              <div class="flex gap-2 items-center">
                <Progress :model-value="100" />
                <p class="font-bold text-sm">100%</p>
              </div>
            </div>
            <div>
              <p class="text-xs">Team Work</p>
              <div class="flex gap-2 items-center">
                <Progress :model-value="70" />
                <p class="font-bold text-sm">70%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped></style>

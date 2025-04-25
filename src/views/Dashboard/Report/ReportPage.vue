<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <p class="text-sm font-bold">Performance</p>

      <Card>
        <CardContent class="flex flex-col gap-4">
          <div class="flex items-center">
            <div class="flex flex-1 flex-col gap-1">
              <p class="text-xs font-medium">DES 3073</p>
              <p class="text-sm font-bold">UI/UX Design</p>
              <p class="text-xs font-light">10:00am - 12:00pm</p>
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

          <Button
            variant="link"
            class="text-black text-xs w-fit self-end underline"
            @click="router.push('/report/details')"
          >
            More
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="flex items-center">
          <div class="flex flex-1 flex-col gap-1">
            <p class="text-xs font-medium">DES 3073</p>
            <p class="text-sm font-bold">UI/UX Design</p>
            <p class="text-xs font-light">10:00am - 12:00pm</p>
          </div>

          <Avatar>
            <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
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
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped></style>

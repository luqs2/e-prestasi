<template>
  <PageContainer>
    <div class="flex flex-col gap-4">
      <p class="text-sm font-bold">My Classes</p>

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

      <Button><PlusCircleIcon />Add Class</Button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircleIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
</script>

<style scoped></style>

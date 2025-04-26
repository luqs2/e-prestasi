<template>
  <ion-app>
    <ion-router-outlet />
    <Toaster />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

console.log("App mounted");
toast("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
</script>

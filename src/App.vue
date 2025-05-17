<template>
  <ion-app>
    <ion-router-outlet />
    <Toaster />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Toaster } from "@/components/ui/sonner";
</script>

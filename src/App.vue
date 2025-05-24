<template>
  <ion-app>
    <SplashScreen v-if="showSplash" @splashComplete="hideSplash" />
    <ion-router-outlet v-else />
    <Toaster />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { Toaster } from "@/components/ui/sonner";
import SplashScreen from "@/views/SplashScreen.vue";
import { ref } from 'vue';

const showSplash = ref(true);

function hideSplash() {
  showSplash.value = false;
}
</script>

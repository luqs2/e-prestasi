<template>
  <ion-page>
    <ion-content :scroll-y="false">
      <div class="flex h-full flex-col overflow-auto bg-background px-8 py-12">
        <slot />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
</script>

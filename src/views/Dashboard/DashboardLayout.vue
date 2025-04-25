<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" class="ion-tab-bar">
        <ion-tab-button tab="home" href="/home">
          <HouseIcon />
          Home
        </ion-tab-button>
        <ion-tab-button tab="class" href="/class">
          <BookIcon />
          Class
        </ion-tab-button>
        <ion-tab-button tab="inbox" href="/inbox">
          <MailIcon />
          Inbox
        </ion-tab-button>
        <ion-tab-button tab="report" href="/report">
          <FileTextIcon />
          Report
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/profile">
          <UserIcon />
          Profile
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import {
  BookIcon,
  FileTextIcon,
  HouseIcon,
  MailIcon,
  UserIcon,
} from "lucide-vue-next";
</script>

<style scoped>
.ion-tab-bar {
  --background: white;
}

ion-tab-button {
  --color: hsl(var(--secondary));
  --color-selected: hsl(var(--secondary));
}
</style>

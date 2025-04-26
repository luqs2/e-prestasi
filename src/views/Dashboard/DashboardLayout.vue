<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" class="ion-tab-bar">
        <ion-tab-button tab="home" href="/home">
          <HouseIcon class="tab-icon" />
          <span class="tab-label">Home</span>
        </ion-tab-button>
        <ion-tab-button tab="class" href="/class">
          <BookIcon class="tab-icon" />
          <span class="tab-label">Class</span>
        </ion-tab-button>
        <ion-tab-button tab="inbox" href="/inbox">
          <MailIcon class="tab-icon" />
          <span class="tab-label">Inbox</span>
        </ion-tab-button>
        <ion-tab-button tab="report" href="/report">
          <FileTextIcon class="tab-icon" />
          <span class="tab-label">Report</span>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/profile">
          <UserIcon class="tab-icon" />
          <span class="tab-label">Profile</span>
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

/* Style for unselected state */
ion-tab-button .tab-icon,
ion-tab-button .tab-label {
  color: hsl(var(--secondary));
}

/* Style for selected state */
ion-tab-button[aria-selected="true"] .tab-icon,
ion-tab-button[aria-selected="true"] .tab-label {
  color: hsl(var(--primary));
}

/* Optional: Add transition for smooth color change */
ion-tab-button .tab-icon,
ion-tab-button .tab-label {
  transition: color 0.2s ease;
}
</style>

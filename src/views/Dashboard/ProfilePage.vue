<template>
  <PageContainer>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">Profile</p>

        <div class="flex gap-4 mb-4">
          <Avatar class="size-16">
            <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div class="flex flex-col justify-center">
            <p class="text-sm font-bold">Ahmad bin Abu</p>
            <p class="text-xs font-light">ahmadhensem@gmail.com</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">General Settings</p>

        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Theme</p>
            <Toggle v-model="isDarkMode">
              <div class="flex items-center justify-center">
                <MoonIcon v-if="isDarkMode" class="size-3 text-primary" />
                <SunIcon v-else class="size-3 text-secondary" />
              </div>
            </Toggle>
          </CardContent>
        </Card>
        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Notifications</p>
            <Toggle v-model="isNotificationsOn"> </Toggle>
          </CardContent>
        </Card>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">Security Settings</p>

        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Change Email</p>
            <ChevronRightIcon />
          </CardContent>
        </Card>
        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Change Password</p>
            <ChevronRightIcon />
          </CardContent>
        </Card>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">Other Settings</p>

        <Card class="p-0">
          <CardContent class="flex flex-1 flex-col py-2 px-4 gap-2">
            <p class="text-xs font-semibold flex flex-1">Language</p>
            <Select v-model="language">
              <SelectTrigger class="w-full bg-muted">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent class="bg-muted text-black">
                <SelectGroup>
                  <SelectItem value="english"> English </SelectItem>
                  <SelectItem value="malay"> Malay </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">Information</p>

        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">About App</p>
            <ChevronRightIcon />
          </CardContent>
        </Card>
        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Terms & Conditions</p>
            <ChevronRightIcon />
          </CardContent>
        </Card>
        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Privacy Policy</p>
            <ChevronRightIcon />
          </CardContent>
        </Card>
        <Card class="p-0">
          <CardContent class="flex flex-1 items-center py-2 px-4">
            <p class="text-xs font-semibold flex flex-1">Share this app</p>
            <Share2Icon />
          </CardContent>
        </Card>
      </div>

      <Button @click="handleLogout" :loading="isLoading">Log Out</Button>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/ui/button/Toggle.vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import {
  ChevronRightIcon,
  MoonIcon,
  Share2Icon,
  SunIcon,
} from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";

// Initialize darkMode from localStorage or system preference
const isDarkMode = ref(false);
const isNotificationsOn = ref(false);
const language = ref("english");
const authStore = useAuthStore();
const isLoading = ref(false);

// Initialize dark mode based on stored preference or system preference
onMounted(() => {
  // Check localStorage first
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
  } else {
    // If no stored preference, check system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  // Apply the theme immediately on mount
  applyTheme(isDarkMode.value);
});

// Watch for changes and apply theme
watch(isDarkMode, (newValue) => {
  applyTheme(newValue);
  // Store preference
  localStorage.setItem('theme', newValue ? 'dark' : 'light');
});

// Function to apply theme
const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Debug output to verify what's happening
  console.log('Dark mode:', isDark, document.documentElement.classList.contains('dark'));
};

const handleLogout = async () => {
  isLoading.value = true;
  await authStore.logout();
  isLoading.value = false;
};
</script>

<style scoped></style>

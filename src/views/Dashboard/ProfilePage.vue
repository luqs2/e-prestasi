<template>
  <PageContainer>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">Profile</p>

        <div class="flex gap-4 mb-4">
          <div class="relative">
            <Avatar class="size-16">
              <AvatarImage 
                v-if="!isUploading"
                :src="user?.user_avatar || getDefaultAvatar(user)" 
                :alt="user?.firstName || 'User'" 
              />
              <div v-else class="flex items-center justify-center size-full bg-muted">
                <span class="animate-pulse">Uploading...</span>
              </div>
              <AvatarFallback>{{ getInitials(user) }}</AvatarFallback>
            </Avatar>
            <!-- Modify the edit icon to open the bottom sheet instead -->
            <div 
              class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
              @click="showAvatarSheet = true" 
            >
              <PencilIcon class="size-3" />
            </div>
            <!-- Hidden file input -->
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="image/*" 
              @change="handleFileUpload"
            />
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-sm font-bold">{{ user?.firstName }} {{ user?.lastName }}</p>
            <p class="text-xs font-light">{{ user?.email }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <p class="text-sm font-bold">General Settings</p>

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

    
    <BottomSheet v-model:open="showAvatarSheet">
      <AvatarSelectionSheet @close="showAvatarSheet = false" />
    </BottomSheet>
  </PageContainer>
</template>

<script setup lang="ts">
import { PencilIcon } from "lucide-vue-next"; 
import { ref as vueRef } from "vue";

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
import { storeToRefs } from "pinia";
import {
  ChevronRightIcon,
  Share2Icon,
} from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";

import BottomSheet from "@/components/BottomSheet.vue";
import AvatarSelectionSheet from "@/components/AvatarSelectionSheet.vue";



const fileInput = vueRef<HTMLInputElement | null>(null);
const isUploading = ref(false);

const isDarkMode = ref(false);
const isNotificationsOn = ref(false);
const language = ref("english");
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isLoading = ref(false);
const showAvatarSheet = ref(false);

onMounted(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme(isDarkMode.value);
});

watch(isDarkMode, (newValue) => {
  applyTheme(newValue);
  localStorage.setItem('theme', newValue ? 'dark' : 'light');
});

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  console.log('Dark mode:', isDark, document.documentElement.classList.contains('dark'));
};

function getInitials(user: any) {
  if (!user) return "NA";
  return (user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "");
}

function getDefaultAvatar(user: any) {
  if (!user) return "";
  const seed = user.email || Math.random().toString();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

const handleLogout = async () => {
  isLoading.value = true;
  await authStore.logout();
  isLoading.value = false;
};


const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  isUploading.value = true;
  
  try {
    const success = await authStore.uploadAvatar(file);
    
    if (!success) {
      console.error('Failed to upload avatar');
    }
  } catch (error) {
    console.error('Error in avatar upload process:', error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped></style>

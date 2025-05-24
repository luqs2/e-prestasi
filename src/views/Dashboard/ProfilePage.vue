<template>
  <ion-page>
    <ion-content>
      <PageContainer>
        <!-- Enhanced header section with user info -->
        <div
          class="flex flex-col sm:flex-row gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-6"
        >
          <div class="flex items-center gap-4">
            <div class="relative">
              <Avatar
                class="h-16 w-16 border-2 border-white shadow-md bg-gray-100"
              >
                <AvatarImage
                  v-if="!isUploading"
                  :src="user?.user_avatar || getDefaultAvatar(user)"
                  :alt="user?.firstName || 'User'"
                />
                <div
                  v-else
                  class="flex items-center justify-center h-full w-full bg-muted"
                >
                  <IonSpinner class="size-6 text-primary" />
                </div>
                <AvatarFallback
                  class="bg-primary/20 text-primary font-bold text-lg"
                >
                  {{ getInitials(user) }}
                </AvatarFallback>
              </Avatar>
              <div
                class="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer shadow-sm hover:bg-primary/90 transition-colors"
                @click="showAvatarSheet = true"
              >
                <PencilIcon class="size-3" />
              </div>
            </div>

            <div>
              <h1 class="text-2xl font-bold text-black break-words">
                {{ user?.firstName }} {{ user?.lastName }}
              </h1>
              <p class="text-gray-600 flex items-start gap-1.5 mt-0.5">
                <Mail class="text-sm flex-shrink-0 mt-1" />
                <span class="break-all">{{ user?.email }}</span>
              </p>
            </div>
          </div>

          <div class="ml-auto flex items-center">
            <Button
              variant="outline"
              class="flex items-center gap-2 rounded-full font-semibold"
              @click="handleLogout"
              :disabled="isLoading"
            >
              <LogOut class="size-4 text-red-600" />
              <span class="text-red-600">{{
                isLoading ? "Logging out..." : "Log Out"
              }}</span>
            </Button>
          </div>
        </div>

        <!-- Settings sections with modern styling -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="flex flex-col gap-6">
            <!-- General Settings -->
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
              <div class="flex items-center gap-2 mb-4">
                <Settings2 class="size-5 text-primary" />
                <h2 class="text-lg font-semibold text-black">
                  General Settings
                </h2>
              </div>

              <div class="space-y-3">
                <Card
                  class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors"
                >
                  <CardContent class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-blue-100 p-2">
                        <Bell class="size-4 text-blue-600" />
                      </div>
                      <div>
                        <p class="font-medium">Notifications</p>
                        <p class="text-xs text-gray-500">
                          Get alerts about new activities
                        </p>
                      </div>
                    </div>
                    <Toggle v-model="isNotificationsOn" />
                  </CardContent>
                </Card>

                <Card
                  class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors"
                >
                  <CardContent class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-purple-100 p-2">
                        <Globe class="size-4 text-purple-600" />
                      </div>
                      <div>
                        <p class="font-medium">Language</p>
                        <p class="text-xs text-gray-500">
                          Choose your preferred language
                        </p>
                      </div>
                    </div>
                    <Select v-model="language" class="w-32">
                      <SelectTrigger class="bg-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent class="bg-white">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="malay">Malay</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <!-- <Card class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors">
                  <CardContent class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-amber-100 p-2">
                        <Sun class="size-4 text-amber-600" />
                      </div>
                      <div>
                        <p class="font-medium">Dark Mode</p>
                        <p class="text-xs text-gray-500">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <Toggle v-model="isDarkMode" />
                  </CardContent>
                </Card> -->
              </div>
            </div>

            <!-- Information section remains unchanged -->
            <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
              <div class="flex items-center gap-2 mb-4">
                <Info class="size-5 text-primary" />
                <h2 class="text-lg font-semibold text-black">Information</h2>
              </div>

              <div class="space-y-3">
                <Card
                  class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors"
                >
                  <CardContent
                    class="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-green-100 p-2">
                        <HelpCircle class="size-4 text-green-600" />
                      </div>
                      <div>
                        <p class="font-medium">About App</p>
                        <p class="text-xs text-gray-500">
                          Learn more about e-Prestasi
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="size-5 text-gray-400" />
                  </CardContent>
                </Card>

                <Card
                  class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors"
                >
                  <CardContent
                    class="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-pink-100 p-2">
                        <FileText class="size-4 text-pink-600" />
                      </div>
                      <div>
                        <p class="font-medium">Terms & Conditions</p>
                        <p class="text-xs text-gray-500">
                          Read our terms of service
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="size-5 text-gray-400" />
                  </CardContent>
                </Card>

                <Card
                  class="border-none bg-gray-50/80 hover:bg-gray-50 transition-colors"
                >
                  <CardContent
                    class="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div class="flex items-center gap-3">
                      <div class="rounded-full bg-indigo-100 p-2">
                        <Shield class="size-4 text-indigo-600" />
                      </div>
                      <div>
                        <p class="font-medium">Privacy Policy</p>
                        <p class="text-xs text-gray-500">
                          How we protect your data
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="size-5 text-gray-400" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <!-- Right Column remains unchanged -->
          <div class="flex flex-col gap-6">
            <!-- Security Settings and Social & Sharing sections remain the same -->
          </div>
        </div>

        <BottomSheet v-model:open="showAvatarSheet">
          <AvatarSelectionSheet @close="showAvatarSheet = false" />
        </BottomSheet>
      </PageContainer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref as vueRef } from "vue";
import PageContainer from "@/components/PageContainer.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/ui/button/Toggle.vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ref, watch, onMounted } from "vue";
// Add these Ionic component imports
import { IonPage, IonContent, IonSpinner } from "@ionic/vue";
import {
  PencilIcon,
  ChevronRight,
  Settings2,
  Bell,
  Mail,
  Globe,
  Info,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  Sun,
} from "lucide-vue-next";

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
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    isDarkMode.value = storedTheme === "dark";
  } else {
    isDarkMode.value = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  }
  applyTheme(isDarkMode.value);
});

watch(isDarkMode, (newValue) => {
  applyTheme(newValue);
  localStorage.setItem("theme", newValue ? "dark" : "light");
});

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
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
      console.error("Failed to upload avatar");
    }
  } catch (error) {
    console.error("Error in avatar upload process:", error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
/* Add subtle hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Toggle button animation */
.toggle-animation {
  transition: background-color 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>

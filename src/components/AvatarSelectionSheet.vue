<template>
  <div class="flex flex-col gap-4 p-2">
    <h3 class="text-lg font-medium text-center">Choose Avatar</h3>

    <!-- Upload your own button -->
    <Button
      variant="outline"
      class="w-full"
      @click="triggerFileUpload"
      :disabled="isLoading"
    >
      <UploadIcon class="mr-2 h-4 w-4" />
      Upload your own
    </Button>
    <input
      type="file"
      ref="fileInputRef"
      class="hidden"
      accept="image/*"
      @change="handleFileUpload"
    />

    <!-- DiceBear avatars -->
    <div>
      <p class="text-sm font-medium mb-2">Select a generated avatar</p>
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="(avatar, index) in avatars"
          :key="index"
          class="aspect-square relative cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
          :class="{
            'opacity-50': isLoading,
            'ring-2 ring-primary': selectedIndex === index,
          }"
          @click="() => !isLoading && selectDiceBearAvatar(avatar.url, index)"
        >
          <img
            :src="avatar.url"
            :alt="`Avatar option ${index + 1}`"
            class="w-full h-full object-cover"
          />
          <div
            v-if="isLoadingAvatar === index"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
          >
            <Loader2Icon class="h-6 w-6 animate-spin text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { UploadIcon, Loader2Icon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "vue-sonner";

const emit = defineEmits(["close"]);

const authStore = useAuthStore();
const fileInputRef = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const isLoadingAvatar = ref<number | null>(null);
const selectedIndex = ref<number | null>(null);
const avatars = ref<{ style: string; url: string }[]>([]);

// Generate an array of DiceBear avatar URLs with different styles and seeds
onMounted(() => {
  generateAvatars();
});

function generateAvatars() {
  const styles = [

    "bottts",
    "lorelei",
    "personas",
    "micah",
  ];

  avatars.value = [];

  // Generate multiple avatars with different seeds
  for (let i = 0; i < 9; i++) {
    const style = styles[Math.floor(i / 3)];
    const seed = Math.random().toString(36).substring(2, 10);
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

    avatars.value.push({ style, url });
  }
}

function triggerFileUpload() {
  fileInputRef.value?.click();
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  isLoading.value = true;

  try {
    const success = await authStore.uploadAvatar(file);

    if (success) {
      toast.success("Avatar updated successfully");
      emit("close");
    } else {
      toast.error("Failed to upload avatar");
    }
  } catch (error) {
    console.error("Error in avatar upload process:", error);
    toast.error("Error uploading avatar");
  } finally {
    isLoading.value = false;
  }
}

async function selectDiceBearAvatar(url: string, index: number) {
  selectedIndex.value = index;
  isLoading.value = true;
  isLoadingAvatar.value = index;

  try {
    const success = await authStore.updateAvatarFromUrl(url);

    if (success) {
      toast.success("Avatar updated successfully");
      emit("close");
    } else {
      toast.error("Failed to set avatar");
    }
  } catch (error) {
    console.error("Error setting DiceBear avatar:", error);
    toast.error("Error updating avatar");
  } finally {
    isLoading.value = false;
    isLoadingAvatar.value = null;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Select Class Image</h3>
      <Button variant="ghost" size="sm" @click="searchImages" :disabled="isLoading">
        <RefreshCwIcon class="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>

    <!-- Search input -->
    <div class="flex gap-2">
      <Input 
        v-model="searchQuery" 
        placeholder="Search for images (e.g. education, school)"
        @keyup.enter="searchImages"
      />
      <Button variant="outline" @click="searchImages" :disabled="isLoading">
        <SearchIcon class="h-4 w-4" />
      </Button>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <Loader2Icon class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Images grid -->
    <div v-else-if="images.length > 0" class="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
      <div 
        v-for="image in images" 
        :key="image.id"
        class="relative aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        :class="{ 'ring-2 ring-primary': selectedImage?.id === image.id }"
        @click="selectImage(image)"
      >
        <img :src="image.webformatURL" :alt="image.tags" class="object-cover w-full h-full" />
      </div>
    </div>

    <!-- No results message -->
    <div v-else-if="!isLoading && searchPerformed" class="flex justify-center py-8">
      <p class="text-sm text-muted-foreground">No images found. Try different search terms.</p>
    </div>

    <!-- Selected image preview -->
    <div v-if="selectedImage" class="flex flex-col gap-2 border rounded-md p-3">
      <p class="text-sm font-medium">Selected Image:</p>
      <div class="relative aspect-video rounded-md overflow-hidden">
        <img :src="selectedImage.webformatURL" :alt="selectedImage.tags" class="object-cover w-full h-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, RefreshCwIcon, SearchIcon } from "lucide-vue-next";

// Update the interface to include the properties we're checking
interface PixabayImage {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
  type?: string;         // Add this property
  imageType?: string;    // Add this property
}

const props = defineProps<{
  initialImage?: string;
}>();

const emit = defineEmits(['select']);

const searchQuery = ref('minimalist student');
const images = ref<PixabayImage[]>([]);
const selectedImage = ref<PixabayImage | null>(null);
const isLoading = ref(false);
const searchPerformed = ref(false);

// Check for initialImage prop when component mounts
onMounted(() => {
  if (props.initialImage) {
    // Create a placeholder selected image from the initial URL
    selectedImage.value = {
      id: 0,  // Use a placeholder ID
      webformatURL: props.initialImage,
      largeImageURL: props.initialImage,
      tags: 'Initial image',
      user: ''
    };
    
    // Then search for new options
    searchImages();
  } else {
    // No initial image, just search
    searchImages();
  }
});

async function searchImages() {
  isLoading.value = true;
  searchPerformed.value = true;
  
  try {
    const apiKey = import.meta.env.VITE_PIXA_JOY_KEY;
    const query = searchQuery.value.trim() || 'education';
    
    // Enhanced parameters for better illustration results
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=illustration&category=education&min_width=800&safesearch=true&per_page=20`
    );
    
    const data = await response.json();
    
    // Additional filter to ensure only illustrations
    images.value = data.hits.filter((img: any) => 
      img.type === 'illustration' || 
      img.imageType === 'illustration'
    );
    
    // If there was a previously selected image, try to find it in the new results
    if (selectedImage.value) {
      const stillExists = images.value.find(img => img.id === selectedImage.value?.id);
      if (!stillExists) {
        selectedImage.value = null;
      }
    }
  } catch (error) {
    console.error('Error fetching images from Pixabay:', error);
  } finally {
    isLoading.value = false;
  }
}

function selectImage(image: PixabayImage) {
  selectedImage.value = image;
  emit('select', image);
}
</script>
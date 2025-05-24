<template>
  <ion-page class="splash-screen" :class="{ 'fade-out': isFading }">
    <div class="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-50 to-white">
      <div class="logo-container mb-8" :class="{ 'zoom-in': showContent }">
        <img
          src="@/assets/E-prestasi-icon-text.png"
          alt="e-Prestasi Logo"
          class="h-48 mb-6 logo"
        />
      </div>
      
      <div class="w-64 progress-container" :class="{ 'show': showContent }">
        <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full progress-bar"
            :style="{ width: `${loadingProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-center text-gray-500 mt-3">Loading resources...</p>
      </div>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showContent = ref(false);
const loadingProgress = ref(0);
const isFading = ref(false);

const emit = defineEmits(['splashComplete']);

// Keep these timing constants
const SPLASH_DURATION = 3200; // milliseconds
const ANIMATION_START_DELAY = 300; // When to start showing content
const FADE_OUT_DELAY = 300; // Delay before fade out starts
const NAVIGATION_DELAY = 500; // Delay before navigation after fade out

onMounted(() => {
  // Remove the localStorage check to show splash every time
  
  // Start the animation sequence immediately
  setTimeout(() => {
    showContent.value = true;
    
    // Calculate loading speed based on total duration
    const updateInterval = 25; // Update every 25ms
    const progressIncrement = 100 / (SPLASH_DURATION / updateInterval);
    
    // Animate progress bar
    const interval = setInterval(() => {
      loadingProgress.value += progressIncrement;
      
      if (loadingProgress.value >= 100) {
        clearInterval(interval);
        
        // Start fade out effect
        setTimeout(() => {
          isFading.value = true;
          
          // Navigate to main app after fade-out animation completes
          setTimeout(navigateToMainApp, NAVIGATION_DELAY);
        }, FADE_OUT_DELAY);
      }
    }, updateInterval);
  }, ANIMATION_START_DELAY);
});

function navigateToMainApp() {
  // Tell parent component that splash is complete
  emit('splashComplete');
  
  // Navigate to login or home based on auth state
  router.push('/login');
}
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  transition: opacity 0.5s ease-out;
}

.fade-out {
  opacity: 0;
}

.logo-container {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s ease-out;
}

.logo-container.zoom-in {
  opacity: 1;
  transform: scale(1);
}

.logo {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.progress-container {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.8s ease-out;
  transition-delay: 0.3s;
}

.progress-container.show {
  opacity: 1;
  transform: translateY(0);
}

.progress-bar {
  transition: width 0.1s linear;
}
</style>
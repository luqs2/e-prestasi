<template>
  <ion-page>
    <ion-content>
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div class="w-full max-w-md">
          <!-- Logo and Header Section -->
          <div class="flex flex-col items-center mb-8">
            <img
              src="@/assets/E-prestasi-icon-text.png"
              alt="e-Prestasi Logo"
              class="h-28 mb-4"
            />
            <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p class="text-gray-600 mt-2 text-center">
              Sign in to continue your learning journey
            </p>
          </div>

          <!-- Login Card -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <form @submit="onSubmit" class="flex flex-col gap-5">
              <!-- Email Field -->
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel class="text-gray-700 font-medium">Email</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <Mail
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4"
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        class="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                        autocomplete="email"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-xs" />
                </FormItem>
              </FormField>

              <!-- Password Field -->
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <div class="flex justify-between">
                    <FormLabel class="text-gray-700 font-medium">Password</FormLabel>
                    <Button
                      variant="link"
                      class="text-xs text-primary p-0 h-auto"
                      type="button"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <FormControl>
                    <div class="relative">
                      <Lock
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4"
                      />
                      <Input
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                        autocomplete="current-password"
                        v-bind="componentField"
                      />
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <Eye v-if="!showPassword" class="size-4" />
                        <EyeOff v-else class="size-4" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage class="text-xs" />
                </FormItem>
              </FormField>

              <!-- Login Button -->
              <Button
                type="submit"
                class="w-full mt-2 bg-primary hover:bg-primary/90 rounded-xl py-6 text-black font-bold"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="flex items-center">
                  <IonSpinner class="size-4 mr-2" /> Signing In...
                </span>
                <span v-else>Sign In</span>
              </Button>
            </form>
          </div>

          <!-- Sign Up Option -->
          <div class="text-center">
            <p class="text-gray-600">
              Don't have an account?
              <Button
                @click="router.push('/signup')"
                variant="link"
                class="text-primary/95 font-extrabold underline p-0 h-auto"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonSpinner } from "@ionic/vue";
import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next";
import * as z from "zod";
import { IonPage, IonContent } from "@ionic/vue";

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);
const authStore = useAuthStore();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    await authStore.login(values.email, values.password);
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Subtle animation for focus states */
.input:focus-within {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

/* Button hover effect */
button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

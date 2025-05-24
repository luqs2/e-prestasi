<template>
  <ion-page>
    <ion-content>
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div class="w-full max-w-md">
          <!-- Logo and Header - More compact than login page -->
          <div class="flex flex-col items-center mb-5">
            <img
              src="@/assets/E-prestasi-icon-text.png"
              alt="e-Prestasi Logo"
              class="h-16 mb-2"
            />
            <h1 class="text-2xl font-bold text-gray-900">Create Account</h1>
            <p class="text-gray-600 text-sm mt-1 text-center">
              Join e-Prestasi today
            </p>
          </div>

          <!-- Signup Card -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-4">
            <form @submit="onSubmit" class="flex flex-col gap-3">
              <!-- Name Fields - Side by side to save space -->
              <div class="grid grid-cols-2 gap-3">
                <FormField v-slot="{ componentField }" name="firstName">
                  <FormItem>
                    <FormLabel class="text-gray-700 text-sm font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <div class="relative">
                        <User
                          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4"
                        />
                        <!-- First Name -->
                        <Input
                          type="text"
                          placeholder="First"
                          class="pl-10 bg-gray-50 border-gray-200 rounded-xl h-10"
                          autocomplete="given-name"
                          v-bind="componentField"
                        />
                      </div>
                    </FormControl>
                    <FormMessage class="text-xs" />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="lastName">
                  <FormItem>
                    <FormLabel class="text-gray-700 text-sm font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <div class="relative">
                        <!-- Last Name -->
                        <Input
                          type="text"
                          placeholder="Last"
                          class="pl-3 bg-gray-50 border-gray-200 rounded-xl h-10"
                          autocomplete="family-name"
                          v-bind="componentField"
                        />
                      </div>
                    </FormControl>
                    <FormMessage class="text-xs" />
                  </FormItem>
                </FormField>
              </div>

              <!-- Email Field -->
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel class="text-gray-700 text-sm font-medium"
                    >Email</FormLabel
                  >
                  <FormControl>
                    <div class="relative">
                      <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        class="pl-10 bg-gray-50 border-gray-200 rounded-xl h-10"
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
                  <FormLabel class="text-gray-700 text-sm font-medium"
                    >Password</FormLabel
                  >
                  <FormControl>
                    <div class="relative">
                      <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="pl-10 bg-gray-50 border-gray-200 rounded-xl h-10"
                        autocomplete="new-password"
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

              <!-- Confirm Password Field -->
              <FormField v-slot="{ componentField }" name="confirmPassword">
                <FormItem>
                  <FormLabel class="text-gray-700 text-sm font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div class="relative">
                      <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                      <Input
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="pl-10 bg-gray-50 border-gray-200 rounded-xl h-10"
                        autocomplete="new-password"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-xs" />
                </FormItem>
              </FormField>

              <!-- Signup Button -->
              <Button
                type="submit"
                class="w-full mt-2 bg-primary hover:bg-primary/90 rounded-xl py-3 text-black font-bold"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="flex items-center justify-center">
                  <IonSpinner class="size-4 mr-2" /> Creating Account...
                </span>
                <span v-else>Create Account</span>
              </Button>
            </form>
          </div>

          <!-- Login Option -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <Button
                @click="router.push('/login')"
                variant="link"
                class="text-primary/95 font-semibold underline p-0 h-auto"
              >
                Sign In
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
import { IonPage, IonContent } from "@ionic/vue";
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
import { Mail, Lock, Eye, EyeOff, User } from "lucide-vue-next";
import * as z from "zod";

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);
const authStore = useAuthStore();

const formSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().min(1, "Required"),
      lastName: z.string().min(1, "Required"),
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Min 6 characters"),
      confirmPassword: z.string().min(6, "Min 6 characters"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords must match",
          path: ["confirmPassword"],
        });
      }
    })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await authStore.signUp(
      values.email,
      values.password,
      values.firstName,
      values.lastName
    );
  } catch (error) {
    console.error("Signup error:", error);
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

<template>
  <Dialog v-model:open="model">
    <DialogContent class="sm:max-w-[90%] max-w-[400px] p-0 rounded-xl border-none overflow-hidden">
      <!-- Compact Header -->
      <div class="bg-gradient-to-r from-primary/90 to-primary/70 p-4 text-white relative">
        <div class="absolute top-2 right-2">
          <button
            @click="model = false"
            class="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 class="text-xl font-bold">Create New Class</h2>
        <p class="text-white/80 text-xs mt-0.5">Fill in the details below</p>
      </div>

      <!-- More compact form section -->
      <div class="p-4">
        <form @submit="onSubmit" class="flex flex-col gap-3">
          <!-- Basic Information Section -->
          <div class="space-y-2">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Basic Information
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <FormField v-slot="{ componentField }" name="classCode">
                <FormItem>
                  <FormLabel class="text-xs text-gray-700">Class Code</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M21.5 12H16c-1.1 0-2-.9-2-2V4.5c0-.3.2-.5.5-.5h.8c.3 0 .6.1.8.4l5.4 5.4c.3.2.4.5.4.8v.8c0 .3-.2.5-.5.5z" />
                          <path d="M17 12v5c0 1.7-1.3 3-3 3H5c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h5" />
                        </svg>
                      </span>
                      <Input
                        type="text"
                        placeholder="e.g. DES 3073"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-[10px]" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="className">
                <FormItem>
                  <FormLabel class="text-xs text-gray-700">Class Name</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                      </span>
                      <Input
                        type="text"
                        placeholder="e.g. Biology"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-[10px]" />
                </FormItem>
              </FormField>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="space-y-2">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
            </h3>

            <FormField v-slot="{ componentField }" name="day">
              <FormItem>
                <FormLabel class="text-xs text-gray-700">Day</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full rounded-lg py-2 text-sm bg-gray-50 border-gray-200 text-black">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent class="bg-white text-sm text-black rounded-lg border border-gray-100">
                      <SelectGroup>
                        <SelectItem
                          value="monday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Monday
                        </SelectItem>
                        <SelectItem
                          value="tuesday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Tuesday
                        </SelectItem>
                        <SelectItem
                          value="wednesday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Wednesday
                        </SelectItem>
                        <SelectItem
                          value="thursday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Thursday
                        </SelectItem>
                        <SelectItem
                          value="friday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Friday
                        </SelectItem>
                        <SelectItem
                          value="saturday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Saturday
                        </SelectItem>
                        <SelectItem
                          value="sunday"
                          class="py-1.5 hover:bg-gray-50 text-black"
                        >
                          Sunday
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-[10px]" />
              </FormItem>
            </FormField>

            <!-- Time inputs in a row for better mobile layout -->
            <div class="grid grid-cols-2 gap-2">
              <FormField v-slot="{ componentField }" name="timeFrom">
                <FormItem>
                  <FormLabel class="text-xs text-gray-700">Start Time</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <Input
                        type="time"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-[10px]" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="timeTo">
                <FormItem>
                  <FormLabel class="text-xs text-gray-700">End Time</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <Input
                        type="time"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-[10px]" />
                </FormItem>
              </FormField>
            </div>

            <!-- Group Info - Single Line -->
            <div class="grid grid-cols-1">
              <FormField v-slot="{ componentField }" name="classGroup">
                <FormItem>
                  <FormLabel class="text-xs text-gray-700">Group</FormLabel>
                  <FormControl>
                    <div class="relative">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </span>
                      <Input
                        type="text"
                        placeholder="A"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                  </FormControl>
                  <FormMessage class="text-[10px]" />
                </FormItem>
              </FormField>
            </div>
          </div>

          <!-- Submit button -->
          <Button
            type="submit"
            :loading="isLoading"
            class="w-full py-2.5 mt-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all"
          >
            <span v-if="isLoading">Creating...</span>
            <span v-else class="flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Class
            </span>
          </Button>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassStore } from "@/stores/classStore";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const model = defineModel<boolean>("open");
const isLoading = ref(false);
const classStore = useClassStore();

const newClassScheme = toTypedSchema(
  z.object({
    classCode: z.string().min(1, "Class code is required"),
    className: z.string().min(1, "Class name is required"),
    day: z.string().min(1, "Day is required"),
    timeFrom: z.string().min(1, "Time from is required"),
    timeTo: z.string().min(1, "Time to is required"),
    classGroup: z.string().min(1, "Class group is required"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: newClassScheme,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  await classStore
    .createClass(
      values.classCode,
      values.className,
      values.day,
      values.timeFrom,
      values.timeTo,
      values.classGroup
    )
    .then(() => {
      model.value = false;
      isLoading.value = false;
    });
});
</script>

<style scoped>
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-content {
  animation: slideUp 0.3s ease-out;
}
</style>

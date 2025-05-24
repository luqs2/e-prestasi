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

        <h2 class="text-xl font-bold">Add Criteria</h2>
        <p class="text-white/80 text-xs mt-0.5">Create new scoring criteria</p>
      </div>

      <!-- Form section -->
      <div class="p-4">
        <form @submit="onSubmit" class="flex flex-col gap-3">
          <!-- Criteria Information Section -->
          <div class="space-y-2">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criteria Details
            </h3>

            <FormField v-slot="{ componentField }" name="criteriaName">
              <FormItem>
                <FormLabel class="text-xs text-gray-700">Criteria Name</FormLabel>
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
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                      </svg>
                    </span>
                    <Input
                      type="text"
                      placeholder="Enter criteria name"
                      class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                      v-bind="componentField"
                    />
                  </div>
                </FormControl>
                <FormMessage class="text-[10px]" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel class="text-xs text-gray-700">Description (Optional)</FormLabel>
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
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                        <line x1="9" y1="9" x2="10" y2="9" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="9" y1="17" x2="15" y2="17" />
                      </svg>
                    </span>
                    <Input
                      type="text"
                      placeholder="Enter description"
                      class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                      v-bind="componentField"
                    />
                  </div>
                </FormControl>
                <FormMessage class="text-[10px]" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="value">
              <FormItem>
                <FormLabel class="text-xs text-gray-700">Point Value</FormLabel>
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
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 18V6" />
                      </svg>
                    </span>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter value"
                      class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                      v-bind="componentField"
                    />
                  </div>
                </FormControl>
                <FormMessage class="text-[10px]" />
              </FormItem>
            </FormField>
          </div>

          <!-- Information Section -->
          <div class="py-2 px-3 bg-blue-50 rounded-lg my-1">
            <p class="text-xs text-blue-600 flex items-start gap-2">
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
                class="mt-0.5 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>
                Point values determine how much each criteria contributes to the overall score.
              </span>
            </p>
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
              Add Criteria
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

const classStore = useClassStore();

const props = defineProps<{
  classId: number;
  onSuccess?: () => void;
}>();

const model = defineModel<boolean>("open");
const isLoading = ref(false);

const criteriaSchema = toTypedSchema(
  z.object({
    criteriaName: z.string().min(1, "Criteria name is required"),
    description: z.string().optional().nullable(),
    value: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number({
        required_error: "Point value is required",
        invalid_type_error: "Value must be a number",
      })
      .min(1, "Value must be at least 1")
    )
  })
);

const { handleSubmit } = useForm({
  validationSchema: criteriaSchema,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await classStore.addCriteriaWithDescription(
      props.classId,
      values.criteriaName,
      values.description ?? null,
      typeof values.value === 'string' ? parseInt(values.value) : values.value
    );
    model.value = false;
    props.onSuccess?.();
  } catch (error) {
    console.error("Error adding criteria:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-content {
  animation: slideUp 0.3s ease-out;
}
</style>

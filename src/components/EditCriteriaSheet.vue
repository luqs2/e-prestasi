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

        <h2 class="text-xl font-bold">Edit Criteria</h2>
        <p class="text-white/80 text-xs mt-0.5">Update scoring criteria details</p>
      </div>

      <!-- Form section -->
      <div class="p-4">
        <form @submit="onSubmit" class="flex flex-col gap-3">
          <!-- Criteria Information Section -->
          <div class="space-y-2">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criteria Details
            </h3>

            <FormField v-slot="{ componentField }" name="name">
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
            :loading="isSubmitting"
            class="w-full py-2.5 mt-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all"
          >
            <span v-if="isSubmitting">Updating...</span>
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
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
              Update Criteria
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
import { ref, watch } from "vue";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const props = defineProps({
  classId: {
    type: Number,
    required: true,
  },
  criteria: {
    type: Object,
    required: true,
  },
  onSuccess: {
    type: Function,
    default: () => {},
  },
});

const model = defineModel<boolean>("open");
const isSubmitting = ref(false);
const classStore = useClassStore();

const criteriaSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Criteria name is required"),
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

const { handleSubmit, setValues } = useForm({
  validationSchema: criteriaSchema,
});

// Set initial values when criteria changes
watch(() => props.criteria, (newCriteria) => {
  if (newCriteria) {
    setValues({
      name: newCriteria.name || "",
      description: newCriteria.description || "",
      value: newCriteria.value || 1,
    });
  }
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    await classStore.updateCriteria(props.classId, props.criteria.id, {
      name: values.name as string,
      description: values.description as string | null,
      value: typeof values.value === 'string' ? parseInt(values.value) : (values.value as number),
    });
    model.value = false;
    props.onSuccess();
  } catch (error) {
    console.error("Error updating criteria:", error);
  } finally {
    isSubmitting.value = false;
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
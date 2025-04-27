<template>
  <BottomSheet v-model:open="model">
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Criteria Name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter criteria name"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description (Optional)</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter description"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="value">
        <FormItem>
          <FormLabel>Point Value</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              placeholder="Enter value"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" :loading="isSubmitting">Update Criteria</Button>
    </form>
  </BottomSheet>
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
import BottomSheet from "./BottomSheet.vue";
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
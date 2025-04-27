<template>
  <BottomSheet v-model:open="model">
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <FormField v-slot="{ componentField }" name="criteriaName">
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

      <FormField v-slot="{ componentField }" name="value">
        <FormItem>
          <FormLabel>Value</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter value"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" :loading="isLoading">Add Criteria</Button>
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
import { ref } from "vue";
import { z } from "zod";
import BottomSheet from "./BottomSheet.vue";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const props = defineProps<{
  classId: number;
  onSuccess?: () => void; // Add new prop for success callback
}>();

const model = defineModel<boolean>("open");
const isLoading = ref(false);
const classStore = useClassStore();

const joinClassScheme = toTypedSchema(
  z.object({
    criteriaName: z.string().min(1, "Criteria name is required"),
    value: z.string().min(1, "Value is required"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: joinClassScheme,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    await classStore.addCriteria(
      props.classId,
      values.criteriaName,
      values.value
    );
    model.value = false;
    props.onSuccess?.(); // Call the success callback if provided
  } catch (error) {
    console.error("Error adding criteria:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

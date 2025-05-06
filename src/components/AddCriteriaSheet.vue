<template>
  <Dialog v-model:open="model">
    <DialogContent class="bg-white text-black">
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
            <FormLabel>Value</FormLabel>
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

        <DialogFooter>
          <Button type="submit" :loading="isLoading">Add Criteria</Button>
        </DialogFooter>
      </form>
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
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const classStore = useClassStore();

const props = defineProps<{
  classId: number;
  onSuccess?: () => void;
}>();

const model = defineModel<boolean>("open");
const isLoading = ref(false);

const joinClassScheme = toTypedSchema(
  z.object({
    criteriaName: z.string().min(1, "Criteria name is required"),
    description: z.string().optional().nullable(),
    value: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z.number({
        required_error: "Value is required",
        invalid_type_error: "Value must be a number",
      })
      .min(1, "Value must be at least 1")
    )
  })
);

const { handleSubmit } = useForm({
  validationSchema: joinClassScheme,
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

<template>
  <Dialog v-model:open="model">
    <DialogContent class="bg-white text-black">
      <DialogHeader>
        <DialogTitle>Join Class</DialogTitle>
        <DialogDescription>
          Enter a class ID to join an existing class.
        </DialogDescription>
      </DialogHeader>
      
      <form @submit="onSubmit" class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="classID">
          <FormItem>
            <FormLabel>Class ID</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Class ID" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit" :loading="isLoading">Join Class</Button>
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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const model = defineModel<boolean>("open");
const isLoading = ref(false);
const classStore = useClassStore();

const joinClassScheme = toTypedSchema(
  z.object({
    classID: z.string().min(1, "Class ID is required"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: joinClassScheme,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  console.log(values);

  await classStore.joinClass(values.classID).then(() => {
    model.value = false;
    isLoading.value = false;
  });
});
</script>

<template>
  <Dialog v-model:open="model">
    <DialogContent class="bg-white text-black max-w-lg">
      <DialogHeader>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new class.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="classCode">
          <FormItem>
            <FormLabel>Class Code</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="eg. DES 3073"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="className">
          <FormItem>
            <FormLabel>Class Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Bahasa Melayu"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="day">
          <FormItem>
            <FormLabel>Day</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="w-full bg-muted">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent class="bg-muted text-black">
                  <SelectGroup>
                    <SelectItem value="monday"> Monday </SelectItem>
                    <SelectItem value="tuesday"> Tuesday </SelectItem>
                    <SelectItem value="wednesday"> Wednesday </SelectItem>
                    <SelectItem value="thursday"> Thursday </SelectItem>
                    <SelectItem value="friday"> Friday </SelectItem>
                    <SelectItem value="saturday"> Saturday </SelectItem>
                    <SelectItem value="sunday"> Sunday </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="timeFrom">
          <FormItem>
            <FormLabel>Time From</FormLabel>
            <FormControl>
              <Input
                type="time"
                placeholder="eg. 10:00am"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="timeTo">
          <FormItem>
            <FormLabel>Time To</FormLabel>
            <FormControl>
              <Input
                type="time"
                placeholder="eg. 10:00am"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="classGroup">
          <FormItem>
            <FormLabel>Group</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="A"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit" :loading="isLoading">Add Class</Button>
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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
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

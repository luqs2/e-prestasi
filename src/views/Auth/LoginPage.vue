<template>
  <PageContainer>
    <div class="flex flex-col gap-6">
      <form @submit="onSubmit" class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="example@domain.com"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="********"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full" :loading="isLoading">Login</Button>
      </form>

      <div class="flex items-center justify-end">
        <!-- Button to sign up -->
        <p class="text-sm">New here?</p>
        <Button
          @click="router.push('/signup')"
          variant="link"
          class="underline text-secondary"
        >
          Sign Up</Button
        >
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as z from "zod";

const router = useRouter();
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  console.log("Form submitted!", values);

  await login(values.email, values.password);
  isLoading.value = false;
});

async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
  } else {
    console.log("User logged in successfully:", data);
    router.push("/home");
  }
}
</script>

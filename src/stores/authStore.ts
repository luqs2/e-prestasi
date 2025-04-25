import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User>();
  const router = useRouter();

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("User logged in successfully:", data);
      if (data.user) {
        const res = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        user.value = res.data;
      }
      router.push("/home");
    }
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("User signed up successfully:", data);

      if (data.user)
        supabase
          .from("profiles")
          .insert([
            {
              user_id: data.user.id,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Error inserting profile:", error.message);
            } else {
              console.log("Profile created successfully");
            }
          });

      router.push("/login");
    }
  }

  return {
    user,

    login,
    signUp,
  };
});

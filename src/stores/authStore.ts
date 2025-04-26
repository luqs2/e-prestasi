import { supabase } from "@/lib/supabase";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
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

    if (error) console.error("Error logging in:", error.message);

    if (data.user) {
      const res = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      user.value = res.data;

      await SecureStoragePlugin.set({
        key: "user_data",
        value: JSON.stringify(data.user),
      });

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

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      user.value = undefined;
      await SecureStoragePlugin.remove({ key: "user_data" });
      router.push("/login");
    }
  }
  return {
    user,

    login,
    signUp,
    logout,
  };
});

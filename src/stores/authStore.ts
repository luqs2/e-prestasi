import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User>();
  const router = useRouter();

  async function getUser() {
    const { data } = await supabase.auth.getSession();
    const res = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.session?.user.id)
      .single();

    user.value = res.data;
  }

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) console.error("Error logging in:", error.message);
    if (data.session) {
      supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      await getUser();
      toast("Success", {
        description: "Logged in successfully",
        position: "top-center",
      });
      router.push("/home");
    }
  }

  async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
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
              firstName: firstName,
              lastName: lastName,
              email: data.user.email,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Error inserting profile:", error.message);
            } else {
              console.log("Profile created successfully");
            }
          });

      toast("Success", {
        description: "Signed up successfully",
        position: "top-center",
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
      router.push("/login");
    }
  }
  return {
    user,

    getUser,
    login,
    signUp,
    logout,
  };
});

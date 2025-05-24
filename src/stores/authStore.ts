import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>();
  const router = useRouter();
  const isLoading = ref(false); // Add isLoading state

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
      toast.success("Logged in successfully");
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
      if (data.user) {
        // Generate random avatar using DiceBear
        const seed = Math.random().toString(36).substring(2, 10);
        const style = "pixel-art-neutral"; // You can use other styles: bottts, pixel-art, lorelei, etc.
        const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

        supabase
          .from("profiles")
          .insert([
            {
              user_id: data.user.id,
              firstName: firstName,
              lastName: lastName,
              email: data.user.email,
              user_avatar: avatarUrl,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Error inserting profile:", error.message);
            } else {
              console.log("Profile created successfully with avatar");
            }
          });
      }

      toast.success("Signed up successfully");
      router.push("/login");
    }
  }

  async function logout() {
    try {
      isLoading.value = true;

      // First, sign out from Supabase
      await supabase.auth.signOut();

      // Clear user data
      user.value = null;

      // Set a flag to indicate logged out status
      localStorage.removeItem("sb-user-authed");

      // Add a slight delay to allow Ionic to complete its cleanup
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Use replace instead of push to clear navigation history
      router.replace("/login");

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAvatar(avatarUrl: string) {
    const { data } = await supabase.auth.getSession();

    if (!data.session?.user.id) {
      console.error("No authenticated user found");
      return false;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ user_avatar: avatarUrl })
      .eq("user_id", data.session.user.id);

    if (error) {
      console.error("Error updating avatar:", error.message);
      return false;
    }

    // Update the local user data
    await getUser();
    return true;
  }

  async function uploadAvatar(file: File) {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId || !file) {
      console.error("No authenticated user found or no file provided");
      return false;
    }

    try {
      // Process file for upload
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("eprestasiimage")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        return false;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("eprestasiimage").getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ user_avatar: publicUrl })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError.message);
        return false;
      }

      // Update local user data
      await getUser();
      return true;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return false;
    }
  }

  async function updateAvatarFromUrl(url: string) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      console.error("No authenticated user found");
      return false;
    }

    try {
      // Update user profile directly with the DiceBear URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ user_avatar: url })
        .eq("user_id", userId);

      if (updateError) {
        console.error(
          "Error updating profile with DiceBear avatar:",
          updateError.message
        );
        return false;
      }

      // Update local user data
      await getUser();
      return true;
    } catch (error) {
      console.error("Error setting DiceBear avatar:", error);
      return false;
    }
  }

  return {
    user,
    getUser,
    login,
    signUp,
    logout,
    updateAvatar,
    uploadAvatar,
    updateAvatarFromUrl,
    isLoading, // Expose isLoading state
  };
});

import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

export const useClassStore = defineStore("class", () => {
  const classes = ref<Class[]>([]);
  const joinedClasses = ref<Class[]>([]);

  async function getClasses() {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching classes:", error.message);
    } else {
      classes.value = data;
    }
  }

  async function getJoinedClasses() {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    const { data, error } = await supabase
      .from("student_class")
      .select(
        `classes(
          id,
          className,
          classCode,
          day,
          timeFrom,
          timeTo,
          user_id,
          created_at)
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching joined classes:", error.message);
    } else {
      console.log("Joined classes fetched successfully:", data);
      // Transform the data to get just the classes array and flatten it
      joinedClasses.value = data
        .map((item) => item.classes as unknown as Class)
        .filter(Boolean);
    }
  }

  async function createClass(
    classCode: string,
    className: string,
    day: string,
    timeFrom: string,
    timeTo: string
  ) {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;
    const { data, error } = await supabase
      .from("classes")
      .insert([
        {
          classCode: classCode,
          className: className,
          day: day,
          timeFrom: timeFrom,
          timeTo: timeTo,
          user_id: userId,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating class:", error.message);
    } else {
      console.log("Class created successfully:", data);
      toast("Success", {
        description: "Class created successfully",
        position: "top-center",
      });
      await getClasses();
    }
  }

  async function joinClass(classId: string) {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    // First check if this is the user's own class
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("user_id")
      .eq("id", classId)
      .single();

    if (classError) {
      toast("Error", {
        description: "Cannot find class",
        position: "top-center",
      });
      console.error("Error checking class:", classError.message);
      return;
    }

    if (classData.user_id === userId) {
      toast("Error", {
        description: "You cannot join your own class",
        position: "top-center",
      });
      console.error("Cannot join your own class");
      return;
    }

    // If not the owner, proceed with joining
    const { data, error } = await supabase.from("student_class").insert([
      {
        class_id: classId,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error("Error joining class:", error.message);
      throw error;
    } else {
      console.log("Joined class successfully:", data);
      toast("Success", {
        description: "Class joined successfully",
        position: "top-center",
      });
      await getJoinedClasses();
    }
  }

  return {
    classes,
    joinedClasses,

    getClasses,
    getJoinedClasses,
    createClass,
    joinClass,
  };
});

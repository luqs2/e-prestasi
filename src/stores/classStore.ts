import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useClassStore = defineStore("class", () => {
  const classes = ref();

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
      await getClasses();
    }
  }
  return {
    classes,

    getClasses,
    createClass,
  };
});

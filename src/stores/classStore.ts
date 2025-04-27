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
          classGroup,
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
    timeTo: string,
    classGroup: string
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
          classGroup: classGroup,
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

  async function getClassById(classId: number) {
    // First check if class is already in the loaded classes
    const foundClass = classes.value.find((c) => c.id === classId);
    if (foundClass) return foundClass;

    // Otherwise fetch from database
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();

    if (error) {
      console.error("Error fetching class details:", error.message);
      throw error;
    }

    return data as Class;
  }

  async function getStudentsInClass(classId: number) {
    console.log("Fetching students in class with ID:", classId);
    const { data, error } = await supabase
      .from("student_class")
      .select("points, profiles(*)")
      .eq("class_id", classId);

    console.log(data);

    if (error) {
      console.error("Error fetching students in class:", error.message);
      throw error;
    }

    return data.map((item) => item);
  }

  async function addCriteria(
    classId: number,
    criteriaName: string,
    value: string
  ) {
    try {
      // First insert the criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from("criterias")
        .insert([
          {
            name: criteriaName,
            value: value,
          },
        ])
        .select()
        .single();

      if (criteriaError) throw criteriaError;
      if (!criteriaData) throw new Error("No criteria data returned");

      // Then create the class-criteria relationship
      const { error: relationError } = await supabase
        .from("class_criterias")
        .insert([
          {
            class_id: classId,
            criteria_id: criteriaData.id,
          },
        ]);

      if (relationError) throw relationError;

      toast("Success", {
        description: "Criteria added successfully",
        position: "top-center",
      });

      return criteriaData;
    } catch (error) {
      console.error("Error adding criteria:", error);
      toast("Error", {
        description: "Failed to add criteria",
        position: "top-center",
      });
      throw error;
    }
  }

  async function getCriterias(classId: number) {
    const { data, error } = await supabase
      .from("class_criterias")
      .select("criterias(*)")
      .eq("class_id", classId);

    if (error) {
      console.error("Error fetching criterias:", error.message);
      throw error;
    }

    return data.map((item) => item.criterias);
  }

  async function removeCriteria(classId: number, criteriaId: number) {
    try {
      // First delete the class-criteria relationship
      const { error: relationError } = await supabase
        .from("class_criterias")
        .delete()
        .eq("class_id", classId)
        .eq("criteria_id", criteriaId);

      if (relationError) throw relationError;

      // Then delete the criteria itself
      const { error: criteriaError } = await supabase
        .from("criterias")
        .delete()
        .eq("id", criteriaId);

      if (criteriaError) throw criteriaError;

      toast("Success", {
        description: "Criteria removed successfully",
        position: "top-center",
      });
    } catch (error) {
      console.error("Error removing criteria:", error);
      toast("Error", {
        description: "Failed to remove criteria",
        position: "top-center",
      });
      throw error;
    }
  }

  async function awardPoints(
    classId: number,
    studentId: string,
    criteriaId: number
  ) {
    try {
      console.log("testestes", classId, studentId);
      // First check if the student is already in the class
      const { data: studentData, error: studentError } = await supabase
        .from("student_class")
        .select("*")
        .eq("class_id", classId)
        .eq("user_id", studentId)
        .single();

      if (studentError) throw studentError;
      if (!studentData) {
        toast("Error", {
          description: "Student not found in this class",
          position: "top-center",
        });
        return;
      }

      console.log("critieriaid", criteriaId);
      //Get the criteria value
      const { data: criteriaData, error: criteriaError } = await supabase
        .from("criterias")
        .select("*")
        .eq("id", criteriaId)
        .single();

      if (criteriaError) throw criteriaError;
      if (!criteriaData) {
        toast("Error", {
          description: "Criteria not found",
          position: "top-center",
        });
        return;
      }

      // Then award points to the student
      const { data: pointsData, error: pointsError } = await supabase
        .from("student_class")
        .update({
          points: studentData.points + parseInt(criteriaData.value),
          pointsHistory: [
            ...(studentData.pointsHistory || []),
            `${criteriaData.name} + ${criteriaData.value}`,
          ],
        })
        .eq("class_id", classId)
        .eq("user_id", studentId);
      console.log("tests", pointsData);

      if (pointsError) throw pointsError;

      toast("Success", {
        description: "Points awarded successfully",
        position: "top-center",
      });
    } catch (error) {
      console.error("Error awarding points:", JSON.stringify(error));
      toast("Error", {
        description: "Failed to award points",
        position: "top-center",
      });
      throw error;
    }
  }

  return {
    classes,
    joinedClasses,

    getClasses,
    getJoinedClasses,
    createClass,
    joinClass,
    getClassById,
    getStudentsInClass,
    addCriteria,
    getCriterias,
    removeCriteria,
    awardPoints,
  };
});

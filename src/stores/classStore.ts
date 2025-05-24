import { supabase } from "@/lib/supabase";
import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

export const useClassStore = defineStore("class", () => {
  const classes = ref<Class[]>([]);
  const joinedClasses = ref<ClassWithPoints[]>([]);

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
        `points, pointsHistory, classes(
          id,
          className,
          classCode,
          day,
          timeFrom,
          timeTo,
          classGroup,
          user_id,
          class_img,
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
        .map((item) => {
          return {
            ...item.classes,
            points: item.points,
            pointsHistory: item.pointsHistory,
          } as unknown as ClassWithPoints;
        })
        .filter(Boolean);
    }
  }

  async function uploadClassImage(imageUrl: string, classId?: number) {
    try {
      // Fetch the image from Pixabay
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Generate a unique file name
      const fileExt = "jpg"; // Most Pixabay images are JPGs
      const fileName = `class-${Date.now()}.${fileExt}`;
      const filePath = `class-images/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("eprestasiimage")
        .upload(filePath, blob);

      if (uploadError) {
        console.error("Error uploading class image:", uploadError.message);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("eprestasiimage").getPublicUrl(filePath);

      // If classId is provided, update the class with the new image
      if (classId) {
        const { error: updateError } = await supabase
          .from("classes")
          .update({ class_img: publicUrl })
          .eq("id", classId);

        if (updateError) {
          console.error(
            "Error updating class with image:",
            updateError.message
          );
          return null;
        }
      }

      return publicUrl;
    } catch (error) {
      console.error("Error in uploadClassImage:", error);
      return null;
    }
  }

  async function createClass(
    classCode: string,
    className: string,
    day: string,
    timeFrom: string,
    timeTo: string,
    classGroup: string,
    classImageUrl?: string // Add this parameter
  ) {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    // First upload the image if provided
    let storageImageUrl = null;
    if (classImageUrl) {
      storageImageUrl = await uploadClassImage(classImageUrl);
    }

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
          class_img: storageImageUrl, // Add this field
          user_id: userId,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating class:", error.message);
    } else {
      console.log("Class created successfully:", data);
      toast.success("Class created successfully");
      await getClasses();
    }
  }

  async function joinClass(classId: string) {
    try {
      // Get the current user's ID
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        console.error("No authenticated user found");
        toast.error("You must be signed in to join a class");
        return false;
      }

      // Check if the student is already in the class - MODIFIED HERE
      const { data: existingEnrollments, error: checkError } = await supabase
        .from("student_class")
        .select("*")
        .eq("user_id", userId)
        .eq("class_id", classId);

      console.log("Checking enrollment:", { userId, classId });
      console.log("Enrollment check result:", existingEnrollments);

      if (checkError) {
        console.error("Error checking class enrollment:", checkError.message);
        toast.error("Failed to join class. Please try again.");
        return false;
      }

      // If student is already enrolled, show an error message
      if (existingEnrollments && existingEnrollments.length > 0) {
        toast.error("You have already joined this class");
        return false;
      }

      // If not enrolled, proceed with joining the class
      const { error } = await supabase.from("student_class").insert([
        {
          user_id: userId,
          class_id: classId,
          points: 0,
        },
      ]);

      if (error) {
        console.error("Error joining class:", error.message);
        toast.error("Failed to join class. Please try again.");
        return false;
      }

      toast.success("Successfully joined class");
      await getJoinedClasses(); // Refresh the list of joined classes
      return true;
    } catch (error) {
      console.error("Error in joinClass function:", error);
      toast.error("An error occurred. Please try again.");
      return false;
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

async function getJoinedClassById(classId: number) {
  try {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;
    
    // First check if this is a class the user created (teacher's class)
    const { data: ownedClass, error: ownedError } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .eq("user_id", userId)
      .single();
    
    // If the user is the teacher of this class, return it
    if (!ownedError && ownedClass) {
      return {
        ...ownedClass,
        points: 0,
        pointsHistory: []
      } as ClassWithPoints;
    }
    
    // Otherwise check if this is a class the user joined (student)
    const { data, error } = await supabase
      .from("student_class")
      .select(
        `points, pointsHistory, classes(
          id,
          className,
          classCode,
          day,
          timeFrom,
          timeTo,
          classGroup,
          user_id,
          class_img,
          created_at)
        `
      )
      .eq("class_id", classId)
      .eq("user_id", userId);

    // If no enrollment found or error occurred, throw informative error
    if (error || !data || data.length === 0) {
      console.error("Error fetching joined class details:", error?.message || "No enrollment found");
      throw new Error("You are not enrolled in this class");
    }

    // Get the first result since we're filtering by user_id and class_id
    const enrollment = data[0];
    
    // Check if classes exists and properly extract it
    if (!enrollment.classes) {
      console.error("No class data returned");
      throw new Error("Class details not found");
    }

    // Transform the response to match the expected format
    const classInfo = Array.isArray(enrollment.classes) 
      ? enrollment.classes[0] 
      : enrollment.classes;
    
    return {
      id: classInfo.id,
      className: classInfo.className,
      classCode: classInfo.classCode,
      day: classInfo.day,
      timeFrom: classInfo.timeFrom,
      timeTo: classInfo.timeTo,
      classGroup: classInfo.classGroup,
      user_id: classInfo.user_id,
      class_img: classInfo.class_img,
      created_at: classInfo.created_at,
      points: enrollment.points,
      pointsHistory: enrollment.pointsHistory
    } as ClassWithPoints;
  } catch (error) {
    console.error("Error in getJoinedClassById:", error);
    throw error;
  }
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

      toast.success("Criteria added successfully");

      return criteriaData;
    } catch (error) {
      console.error("Error adding criteria:", error);
      toast.error("Failed to add criteria");
      throw error;
    }
  }

  async function addCriteriaWithDescription(
    classId: number,
    criteriaName: string,
    description: string | null,
    value: number
  ) {
    try {
      // First insert the criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from("criterias")
        .insert([
          {
            name: criteriaName,
            description: description,
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

      toast.success("Criteria added successfully");

      return criteriaData;
    } catch (error) {
      console.error("Error adding criteria:", error);
      toast.error("Failed to add criteria");
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

      toast.success("Criteria removed successfully");
    } catch (error) {
      console.error("Error removing criteria:", error);
      toast.error("Failed to remove criteria");
      throw error;
    }
  }

  async function updateCriteria(
    classId: number,
    criteriaId: number,
    criteriaData: any
  ) {
    // Optional: First verify the criteria belongs to this class through the join table
    const { error: relationError } = await supabase
      .from("class_criterias")
      .select("*")
      .eq("class_id", classId)
      .eq("criteria_id", criteriaId)
      .single();

    if (relationError) {
      console.error("Error verifying criteria relationship:", relationError.message);
      throw relationError;
    }

    // Then update the criteria itself (only filtering by criteria ID)
    const { data, error } = await supabase
      .from("criterias")
      .update(criteriaData)
      .eq("id", criteriaId);

    if (error) {
      console.error("Error updating criteria:", error.message);
      throw error;
    }

    return data;
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
        toast.error("Student not found in this class");
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
        toast.error("Criteria not found");
        return;
      }

      // Then award points to the student
      const { data: pointsData, error: pointsError } = await supabase
        .from("student_class")
        .update({
          points: studentData.points + parseInt(criteriaData.value),
          pointsHistory: [
            ...(studentData.pointsHistory || []),
            `${criteriaData.name} + ${
              criteriaData.value
            } + ${new Date().toISOString()}`,
          ],
        })
        .eq("class_id", classId)
        .eq("user_id", studentId);
      console.log("tests", pointsData);

      if (pointsError) throw pointsError;

      toast.success("Points awarded successfully");
    } catch (error) {
      console.error("Error awarding points:", JSON.stringify(error));
      toast.error("Failed to award points");
      throw error;
    }
  }

  async function deleteClass(classId: number) {
    try {
      // Get current user to verify ownership
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        console.error("No authenticated user found");
        return false;
      }

      // Verify class ownership before deletion
      const { data: classData } = await supabase
        .from("classes")
        .select("user_id")
        .eq("id", classId)
        .single();

      if (!classData || classData.user_id !== userId) {
        console.error("Not authorized to delete this class");
        return false;
      }

      // Delete all related records first (to avoid foreign key constraints)

      // 1. Delete student_class entries
      await supabase.from("student_class").delete().eq("class_id", classId);

      // 2. Delete criteria_class entries
      await supabase.from("criteria_class").delete().eq("class_id", classId);

      // 3. Delete class_criterias entries
      await supabase.from("criterias").delete().eq("class_id", classId);

      // 4. Finally delete the class itself
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", classId);

      if (error) {
        console.error("Error deleting class:", error.message);
        return false;
      }

      // Refresh the classes list
      await getClasses();
      return true;
    } catch (error) {
      console.error("Error in deleteClass function:", error);
      return false;
    }
  }

  async function leaveClass(classId: number) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        console.error("No authenticated user found");
        return false;
      }

      const { error } = await supabase
        .from("student_class")
        .delete()
        .eq("user_id", userId)
        .eq("class_id", classId);

      if (error) {
        console.error("Error leaving class:", error.message);
        return false;
      }

      // Refresh joined classes
      await getJoinedClasses();
      return true;
    } catch (error) {
      console.error("Error in leaveClass function:", error);
      return false;
    }
  }

  async function getStudentCount(classId: number) {
    const { count, error } = await supabase
      .from("student_class")
      .select("*", { count: "exact", head: true })
      .eq("class_id", classId);

    if (error) {
      console.error("Error fetching student count:", error.message);
      return 0;
    }
    return count || 0;
  }

  async function getStudentCriterias(classId: number) {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;

    // First get the criteria for this class
    const { data: criteriaData, error: criteriaError } = await supabase
      .from("criterias")
      .select("*")
      .eq("class_id", classId);

    if (criteriaError) {
      console.error("Error fetching criteria:", criteriaError.message);
      return [];
    }

    // Then get the student's awarded points for each criteria
    const { data: pointsData, error: pointsError } = await supabase
      .from("student_points")
      .select("*")
      .eq("class_id", classId)
      .eq("user_id", userId);

    if (pointsError) {
      console.error("Error fetching student points:", pointsError.message);
      return [];
    }

    // Combine the data to show each criteria with points awarded
    return criteriaData.map((criteria) => {
      // Find awarded points for this criteria (if any)
      const pointsEntry = pointsData.find((p) => p.criteria_id === criteria.id);
      return {
        id: criteria.id,
        name: criteria.name,
        value: criteria.value,
        points_awarded: pointsEntry ? pointsEntry.points : 0,
      };
    });
  }

  async function getAllClassCriterias(classId: number) {
    // Get all criteria for this class
    const { data: criteriaData, error: criteriaError } = await supabase
      .from("criterias")
      .select("*")
      .eq("class_id", classId);

    if (criteriaError) {
      console.error("Error fetching criteria:", criteriaError.message);
      return [];
    }

    // Get all points awarded for all students
    const { data: pointsData, error: pointsError } = await supabase
      .from("student_points")
      .select("*")
      .eq("class_id", classId);

    if (pointsError) {
      console.error("Error fetching student points:", pointsError.message);
      return [];
    }

    // Combine the data to show each criteria with total points awarded across all students
    return criteriaData.map((criteria) => {
      // Find all points entries for this criteria
      const criteriaPoints = pointsData.filter(
        (p) => p.criteria_id === criteria.id
      );
      const totalPointsAwarded = criteriaPoints.reduce(
        (sum, point) => sum + point.points,
        0
      );

      return {
        id: criteria.id,
        name: criteria.name,
        value: criteria.value,
        points_awarded: totalPointsAwarded,
        students_awarded: criteriaPoints.length,
      };
    });
  }

  return {
    classes,
    joinedClasses,
    getStudentCount,

    getClasses,
    getJoinedClasses,
    createClass,
    joinClass,
    getClassById,
    getJoinedClassById,
    getStudentsInClass,
    addCriteria,
    addCriteriaWithDescription,
    getCriterias,
    removeCriteria,
    updateCriteria,
    awardPoints,
    uploadClassImage,
    deleteClass,
    leaveClass,
    getStudentCriterias,
    getAllClassCriterias,
  };
});

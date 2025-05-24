<template>
  <PageContainer>
    <!-- Redesigned header with class info -->
    <div class="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm mb-6">
      <Button variant="outline" size="icon" class="rounded-xl" @click="router.back()">
        <ChevronLeft class="size-5 text-primary/50" />
      </Button>
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
          <div class="bg-white/30 text-[10px] font-medium py-0.5 px-2 rounded-full w-fit mb-1 backdrop-blur-sm">
            <span class="text-black text-sm">{{ classDetails?.classCode }}</span>
          </div>
          <span class="font-bold text-lg">{{ classDetails?.className }}</span>
        </div>
        <Avatar class="h-10 w-10 border-2 border-white/50">
          <div class="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold text-black">
            {{ classDetails?.classGroup }}
          </div>
        </Avatar>
      </div>
    </div>

    <!-- Performance Summary Section -->
    <Card class="bg-gradient-to-r from-primary/90 to-primary/70 text-white rounded-xl overflow-hidden border-none shadow-md mb-6">
      <CardContent class="p-6">
        <h3 class="font-semibold text-lg mb-4 text-black">Performance Summary</h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card class="bg-white/30 backdrop-blur-sm border-none">
            <CardContent class="p-4">
              <div class="flex items-center gap-2">
                <Award class="h-5 w-5 text-black" />
                <p class="text-sm font-medium text-black">Overall Grade</p>
              </div>
              <p class="text-2xl font-bold text-black mt-2">A</p>
            </CardContent>
          </Card>
          
          <Card class="bg-white/30 backdrop-blur-sm border-none">
            <CardContent class="p-4">
              <div class="flex items-center gap-2">
                <Calendar class="h-5 w-5 text-black" />
                <p class="text-sm font-medium text-black">Attendance</p>
              </div>
              <p class="text-2xl font-bold text-black mt-2">95%</p>
            </CardContent>
          </Card>
          
          <Card class="bg-white/30 backdrop-blur-sm border-none">
            <CardContent class="p-4">
              <div class="flex items-center gap-2">
                <ClipboardCheck class="h-5 w-5 text-black" />
                <p class="text-sm font-medium text-black">Assignment</p>
              </div>
              <p class="text-2xl font-bold text-black mt-2">18/20</p>
            </CardContent>
          </Card>
          
          <Card class="bg-white/30 backdrop-blur-sm border-none">
            <CardContent class="p-4">
              <div class="flex items-center gap-2">
                <MessageCircle class="h-5 w-5 text-black" />
                <p class="text-sm font-medium text-black">Participation</p>
              </div>
              <p class="text-2xl font-bold text-black mt-2">Good</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <!-- Student Ranking Section -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-black mb-4">Class Ranking</h2>

      <!-- Loading spinner -->
      <div v-if="loading" class="flex items-center justify-center h-40">
        <div class="flex flex-col items-center gap-4">
          <IonSpinner class="size-12 text-primary" />
          <p class="text-gray-500 text-sm animate-pulse">Loading student rankings...</p>
        </div>
      </div>

      <!-- Empty state for no students -->
      <div v-else-if="students.length === 0" class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100">
        <div class="max-w-md mx-auto">
          <div class="text-primary/30 mb-4">
            <Users class="size-12 mx-auto" />
          </div>
          <p class="text-gray-500 mb-2">No students enrolled in this class yet</p>
          <p class="text-gray-400 text-sm">Students will appear here once they join</p>
        </div>
      </div>

      <!-- Student ranking list -->
      <div v-else class="flex flex-col gap-2">
        <Card
          v-for="(student, index) in sortedStudents"
          :key="student.profiles.id"
          class="border-none shadow-sm hover:shadow-md transition-all overflow-hidden relative"
          :class="isCurrentUser(student) ? '!bg-primary/80' : 'bg-white/80'"
        >
          <div 
            class="absolute inset-y-0 left-0 w-1"
            :class="{
              'bg-amber-500': index === 0,
              'bg-slate-400': index === 1,
              'bg-amber-800': index === 2,
              'bg-blue-400': index > 2
            }"
          ></div>
          <CardContent class="flex items-center p-4 pl-6">
            <div class="flex items-center gap-3 flex-1">
              <div class="flex items-center justify-center min-w-8 w-8 h-8 rounded-full" 
                :class="{
                  'bg-amber-500 text-black': index === 0,
                  'bg-slate-400 text-black': index === 1,
                  'bg-amber-800 text-white': index === 2,
                  'bg-blue-400 text-white': index > 2
                }">
                <span class="font-bold text-sm">{{ index + 1 }}</span>
              </div>
              
              <Avatar class="h-10 w-10 border border-primary/20">
                <AvatarImage
                  v-if="student.profiles?.user_avatar"
                  :src="student.profiles.user_avatar"
                  :alt="getStudentName(student.profiles)"
                />
                <AvatarFallback
                  :class="isCurrentUser(student) ? 'bg-white/20 text-black' : 'bg-primary/10 text-primary'"
                  class="font-medium"
                >
                  {{ getInitials(getStudentName(student.profiles)) }}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <p class="font-medium" :class="isCurrentUser(student) ? 'text-black' : ''">
                  {{ getStudentName(student.profiles) }}
                  <span v-if="isCurrentUser(student)" class="text-xs font-bold ml-1">(You)</span>
                </p>
                <p class="text-xs" :class="isCurrentUser(student) ? 'text-black/70' : 'text-muted-foreground'">
                  Student
                </p>
              </div>
            </div>
            
            <Badge 
              class="px-3 py-1"
              :class="isCurrentUser(student) ? 'bg-white/30 text-black' : 'bg-primary/10 text-primary'"
            >
              {{ student.points || 0 }} points
            </Badge>
          </CardContent>
        </Card>

        <Button
          v-if="students.length > 5 && !showAll"
          @click="showAll = true"
          variant="outline"
          class="text-xs flex items-center justify-center w-full rounded-xl mt-2 py-2"
        >
          <ChevronDown class="size-4 mr-2" />
          View complete rankings
        </Button>
      </div>
    </div>

    <!-- Points History Section -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-black mb-4">
        {{ isTeacher ? "Student Points History" : "Points History" }}
      </h2>

      <!-- Loading state -->
      <div v-if="loadingCriterias" class="flex items-center justify-center h-20">
        <div class="flex flex-col items-center gap-2">
          <IonSpinner class="size-8 text-primary" />
          <p class="text-gray-500 text-xs animate-pulse">Loading criteria...</p>
        </div>
      </div>

      <!-- Empty state for no criteria -->
      <div
        v-else-if="(isTeacher && allStudentPointsHistory.length === 0) || (!isTeacher && criterias.length === 0)"
        class="bg-gray-50 rounded-xl p-10 text-center border border-gray-100"
      >
        <div class="max-w-md mx-auto">
          <div class="text-primary/30 mb-4">
            <History class="size-12 mx-auto" />
          </div>
          <p class="text-gray-500 mb-2">No points history found</p>
          <p class="text-gray-400 text-sm">
            {{ isTeacher ? "No points have been awarded to students yet" : "Point records will appear here when you earn them" }}
          </p>
        </div>
      </div>

      <!-- Teacher view: Points history with student names -->
      <div v-else-if="isTeacher && allStudentPointsHistory.length > 0" class="flex flex-col gap-2">
        <Card
          v-for="(entry, idx) in allStudentPointsHistory"
          :key="idx"
          class="overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-white/80"
        >
          <CardContent class="p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-green-100 p-2">
                <PlusCircle class="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-medium text-sm">{{ entry.criteriaName }}</p>
                  <Badge class="bg-blue-50 text-blue-700 text-xs">{{ entry.studentName }}</Badge>
                </div>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(entry.date) }}
                </p>
              </div>
            </div>
            <Badge class="bg-green-50 text-green-700 rounded-full px-3">
              +{{ entry.points }} points
            </Badge>
          </CardContent>
        </Card>
      </div>

      <!-- Student view: Points history cards (existing) -->
      <div v-else-if="!isTeacher && filteredPointsHistory.length > 0" class="flex flex-col gap-2">
        <Card
          v-for="(entry, idx) in filteredPointsHistory"
          :key="idx"
          class="overflow-hidden border-none shadow-sm hover:shadow-md transition-all bg-white/80"
        >
          <CardContent class="p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-green-100 p-2">
                <PlusCircle class="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p class="font-medium text-sm">{{ entry.split(' + ')[0] }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(entry.split(' + ')[2]) }}
                </p>
              </div>
            </div>
            <Badge class="bg-green-50 text-green-700 rounded-full px-3">
              +{{ entry.split(' + ')[1] }} points
            </Badge>
          </CardContent>
        </Card>
      </div>

      <!-- No points history -->
      <div v-else class="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
        <p class="text-sm text-gray-500">No points history yet.</p>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useClassStore } from "@/stores/classStore";
import { IonSpinner } from "@ionic/vue";
import { 
  ChevronLeft, 
  Users, 
  Award, 
  Calendar,
  ClipboardCheck,
  MessageCircle,
  History,
  PlusCircle,
  ChevronDown
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner"; // Add this import if not already present

const router = useRouter();
const route = useRoute();
const classStore = useClassStore();
const classId = Number(route.params.id);

const classDetails = ref<ClassWithPoints | null>(null);
const students = ref<ClassUser[]>([]);
const loading = ref(true);
const showAll = ref(false);
const criterias = ref<any[]>([]);
const loadingCriterias = ref(true);
const currentUserId = ref<string | null>(null);

// Add a new ref to track if user is a teacher
const isTeacher = ref(false);
const allStudentPointsHistory = ref<any[]>([]);

// Sort students by points (highest first)
const sortedStudents = computed(() => {
  // If showAll is false, show only top 5 students
  const sorted = [...students.value].sort((a, b) => b.points - a.points);
  return showAll.value ? sorted : sorted.slice(0, 5);
});

// Get initials from full name for avatar fallback
function getInitials(name: string): string {
  if (!name) return "N/A";
  return name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Get student name
function getStudentName(profile: UserProfile | null | undefined): string {
  if (!profile) return "Unknown Student";

  // Check if full_name exists
  if (profile.full_name) return profile.full_name;

  // Otherwise combine firstName and lastName
  return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
}

// Format date
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isCurrentUser(student: any) {
  return student.profiles && student.profiles.id === currentUserId.value;
}

// Modify the onMounted function
onMounted(async () => {
  try {
    // Get current user ID
    const { data } = await supabase.auth.getSession();
    currentUserId.value = data.session?.user.id || null;

    // Check if user is teacher (owner) of this class
    const { data: classData } = await supabase
      .from("classes")
      .select("user_id")
      .eq("id", classId)
      .single();
    
    isTeacher.value = classData?.user_id === currentUserId.value;

    // Load class details - with different approach for teachers
    if (isTeacher.value) {
      // For teachers, get class directly
      const { data: teacherClassData } = await supabase
        .from("classes")
        .select("*")
        .eq("id", classId)
        .single();
        
      if (teacherClassData) {
        classDetails.value = {
          ...teacherClassData,
          points: 0,
          pointsHistory: [] // Will be populated separately for teachers
        };
        
        // Fetch all students' point history for this class
        const { data: studentClasses } = await supabase
          .from("student_class")
          .select("user_id, pointsHistory, profiles(firstName, lastName)")
          .eq("class_id", classId)
          .not("pointsHistory", "is", null);
          
        if (studentClasses) {
          // Flatten all point histories with student names
          allStudentPointsHistory.value = studentClasses.flatMap(student => {
            if (!student.pointsHistory || !Array.isArray(student.pointsHistory)) return [];
            
            // Handle profiles data that might be an array or a single object
            const profile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
            
            return student.pointsHistory.map((entry: string) => {
              const parts = entry.split(' + ');
              const studentName = profile ? 
                `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 
                'Unknown Student';
                
              return {
                criteriaName: parts[0] || 'Unknown Activity',
                points: parts[1] || '0',
                date: parts[2] || new Date().toISOString(),
                studentName: studentName
              };
            });
          });
          
          // Sort by date (newest first)
          allStudentPointsHistory.value.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        }
      }
    } else {
      // For students, use existing method
      classDetails.value = await classStore.getJoinedClassById(classId);
    }

    // Load students in class (same for both teachers and students)
    const studentsData = await classStore.getStudentsInClass(classId);

    // Transform the data to match the ClassUser interface
    students.value = studentsData.map((student) => {
      return {
        points: student.points,
        // If profiles is an array, take the first element
        profiles: Array.isArray(student.profiles)
          ? student.profiles[0]
          : student.profiles,
      };
    });

    // Load criteria differently based on user role
    if (isTeacher.value) {
      // For teachers, we already have the history in allStudentPointsHistory
      criterias.value = allStudentPointsHistory.value;
    } else {
      // For students, use the existing approach
      criterias.value = classDetails.value?.pointsHistory || [];
    }
  } catch (error) {
    console.error("Error loading data:", error);
    toast.error("Failed to load report data");
  } finally {
    // Always set loading to false to prevent infinite loading
    loading.value = false;
    loadingCriterias.value = false;
  }
});

// Modify the computed property for filteredPointsHistory
const filteredPointsHistory = computed<string[]>(() => {
  if (isTeacher.value) {
    return [];
  }
  
  if (!classDetails.value || !Array.isArray(classDetails.value.pointsHistory)) {
    return [];
  }
  
  // First convert to unknown type (to avoid direct number[] to string[] conversion)
  const mixedArray = classDetails.value.pointsHistory as unknown;
  // Then safely convert to any[] to allow filtering
  const anyArray = mixedArray as any[];
  
  // Finally filter for only string values
  return anyArray
    .filter(entry => typeof entry === "string")
    .map(entry => String(entry)); // Ensure each entry is definitely a string
});
</script>

<style scoped>
/* Card hover animation */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Loading animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

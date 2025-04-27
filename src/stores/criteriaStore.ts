import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Criterion, NewCriterion, CriterionUpdate } from '@/types/criteria';

// Mock data for development and testing
const mockCriteria: Criterion[] = [
  {
    id: 1,
    name: "Class Participation",
    description: "Active engagement in class discussions and activities",
    class_id: 1,
    created_at: "2025-04-15T10:00:00Z",
    updated_at: "2025-04-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Homework Completion",
    description: "Timely submission and quality of assigned homework",
    class_id: 1,
    created_at: "2025-04-15T10:05:00Z",
    updated_at: "2025-04-15T10:05:00Z"
  },
  {
    id: 3,
    name: "Quizzes",
    description: "Performance on in-class quizzes",
    class_id: 1,
    created_at: "2025-04-15T10:10:00Z",
    updated_at: "2025-04-15T10:10:00Z"
  },
  {
    id: 4,
    name: "Mid-Term Exam",
    description: "Performance on mid-term examination",
    class_id: 1,
    created_at: "2025-04-15T10:15:00Z",
    updated_at: "2025-04-15T10:15:00Z"
  },
  {
    id: 5,
    name: "Final Exam",
    description: "Performance on final examination",
    class_id: 1,
    created_at: "2025-04-15T10:20:00Z",
    updated_at: "2025-04-15T10:20:00Z"
  }
];

// Flag to use mock data (set to false when ready for production)
const USE_MOCK_DATA = true;

export const useCriteriaStore = defineStore('criteria', () => {
  // State
  const criteria = ref<Criterion[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Get all criteria for a specific class
  async function getCriteriaByClassId(classId: number) {
    isLoading.value = true;
    error.value = null;
    
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock data for the requested class
      criteria.value = mockCriteria.filter(c => c.class_id === classId);
      isLoading.value = false;
      return criteria.value;
    }
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('criteria')
        .select('*')
        .eq('class_id', classId)
        .order('created_at');
      
      if (supabaseError) throw supabaseError;
      
      criteria.value = data || [];
      return data;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching criteria:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  // Add a new criterion
  async function addCriterion(criterion: NewCriterion) {
    isLoading.value = true;
    error.value = null;
    
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new mock criterion
      const newCriterion: Criterion = {
        id: mockCriteria.length + 1,
        ...criterion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock data
      mockCriteria.push(newCriterion);
      
      // Update local state
      criteria.value.push(newCriterion);
      
      isLoading.value = false;
      return newCriterion;
    }
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('criteria')
        .insert(criterion)
        .select();
      
      if (supabaseError) throw supabaseError;
      
      if (data && data.length > 0) {
        criteria.value.push(data[0]);
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error adding criterion:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Update an existing criterion
  async function updateCriterion(id: number, updates: CriterionUpdate) {
    isLoading.value = true;
    error.value = null;
    
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the mock criterion to update
      const mockIndex = mockCriteria.findIndex(c => c.id === id);
      
      if (mockIndex !== -1) {
        // Update the mock data
        const updatedCriterion = {
          ...mockCriteria[mockIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        mockCriteria[mockIndex] = updatedCriterion;
        
        // Update local state
        const stateIndex = criteria.value.findIndex(c => c.id === id);
        if (stateIndex !== -1) {
          criteria.value[stateIndex] = updatedCriterion;
        }
        
        isLoading.value = false;
        return updatedCriterion;
      }
      
      isLoading.value = false;
      return null;
    }
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('criteria')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (supabaseError) throw supabaseError;
      
      if (data && data.length > 0) {
        const index = criteria.value.findIndex(c => c.id === id);
        if (index !== -1) {
          criteria.value[index] = data[0];
        }
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error updating criterion:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Delete a criterion
  async function deleteCriterion(id: number) {
    isLoading.value = true;
    error.value = null;
    
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from mock data
      const mockIndex = mockCriteria.findIndex(c => c.id === id);
      if (mockIndex !== -1) {
        mockCriteria.splice(mockIndex, 1);
      }
      
      // Update local state
      criteria.value = criteria.value.filter(c => c.id !== id);
      
      isLoading.value = false;
      return true;
    }
    
    try {
      const { error: supabaseError } = await supabase
        .from('criteria')
        .delete()
        .eq('id', id);
      
      if (supabaseError) throw supabaseError;
      
      criteria.value = criteria.value.filter(c => c.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message;
      console.error('Error deleting criterion:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    criteria,
    isLoading,
    error,
    getCriteriaByClassId,
    addCriterion,
    updateCriterion,
    deleteCriterion
  };
});
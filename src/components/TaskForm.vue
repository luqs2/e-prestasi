<template>
  <div class="flex flex-col gap-4">
    <div class="space-y-2">
      <Label for="taskName">Task Name</Label>
      <Input v-model="form.task_name" id="taskName" placeholder="Enter task name" />
    </div>
    
    <div class="space-y-2">
      <Label for="description">Description (optional)</Label>
      <Textarea v-model="form.description" id="description" placeholder="Enter task description" />
    </div>
    
    <div class="space-y-2">
      <Label for="endDate">Due Date</Label>
      <Input v-model="form.end_date" id="endDate" type="date" />
    </div>
    
    <Button 
      class="w-full" 
      @click="handleSubmit" 
      :disabled="!isValid || isSubmitting"
      :loading="isSubmitting"
    >
      {{ props.task ? 'Update Task' : 'Add Task' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const props = defineProps({
  classId: {
    type: Number,
    required: true
  },
  task: {
    type: Object as () => Task | null,
    default: null
  }
});

const emit = defineEmits(['success', 'cancel']);

const form = ref({
  task_name: '',
  description: '',
  end_date: '',
  class_id: props.classId
});

const isSubmitting = ref(false);

const isValid = computed(() => {
  return form.value.task_name.trim() !== '' && 
         form.value.end_date !== '';
});

onMounted(() => {
  if (props.task) {
    form.value = {
      task_name: props.task.task_name,
      description: props.task.description || '',
      end_date: props.task.end_date,
      class_id: props.classId
    };
  }
});

async function handleSubmit() {
  isSubmitting.value = true;
  emit('success', form.value);
  isSubmitting.value = false;
}
</script>
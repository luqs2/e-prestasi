<template>
  <Dialog v-model:open="model">
    <DialogContent class="sm:max-w-[90%] max-w-[400px] p-0 rounded-xl border-none overflow-hidden">
      <!-- Compact Header -->
      <div class="bg-gradient-to-r from-primary/90 to-primary/70 p-4 text-white relative">
        <div class="absolute top-2 right-2">
          <button
            @click="model = false"
            class="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <h2 class="text-xl font-bold">Join Class</h2>
        <p class="text-white/80 text-xs mt-0.5">Enter a class ID or scan a QR code</p>
      </div>

      <!-- Form section -->
      <div class="p-4">
        <form @submit="onSubmit" class="flex flex-col gap-3">
          <!-- Class ID Section -->
          <div class="space-y-2">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class Details
            </h3>

            <FormField v-slot="{ componentField }" name="classID">
              <FormItem>
                <FormLabel class="text-xs text-gray-700">Class ID</FormLabel>
                <FormControl>
                  <div class="relative flex gap-2">
                    <div class="relative flex-1">
                      <span class="absolute left-2.5 top-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                          <path d="M16.5 9.4 7.55 4.24" />
                          <polyline points="3.29 7 12 12 20.71 7" />
                          <line x1="12" y1="22" x2="12" y2="12" />
                          <circle cx="18.5" cy="15.5" r="2.5" />
                          <path d="M20.27 17.27 22 19" />
                        </svg>
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter class ID"
                        class="pl-8 py-2 text-sm rounded-lg bg-gray-50 border-gray-200 focus:border-primary/50 text-black"
                        v-bind="componentField"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      @click="handleScanQR"
                      :loading="isScanning"
                      class="h-[38px] w-[38px] rounded-lg bg-primary/5 border-gray-200 hover:bg-primary/10 text-gray-600"
                    >
                      <QrCodeIcon class="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage class="text-[10px]" />
              </FormItem>
            </FormField>
          </div>

          <!-- Information Section -->
          <div class="py-2 px-3 bg-blue-50 rounded-lg my-1">
            <p class="text-xs text-blue-600 flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>
                You can get the class ID from your teacher or scan a QR code if available.
              </span>
            </p>
          </div>

          <!-- Submit button -->
          <Button
            type="submit"
            :loading="isLoading"
            class="w-full py-2.5 mt-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all"
          >
            <span v-if="isLoading">Joining...</span>
            <span v-else class="flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Join Class
            </span>
          </Button>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useClassStore } from "@/stores/classStore";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { QrCodeIcon } from "lucide-vue-next";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";
import { toast } from "vue-sonner";

const model = defineModel<boolean>("open");
const isLoading = ref(false);
const isScanning = ref(false);
const classStore = useClassStore();

const joinClassScheme = toTypedSchema(
  z.object({
    classID: z.string().min(1, "Class ID is required"),
  })
);

const { handleSubmit, setFieldValue } = useForm<{ classID: string }>({
  validationSchema: joinClassScheme,
});

const handleScanQR = async () => {
  try {
    isScanning.value = true;
    document.querySelector("body")?.classList.add("scanner-active");

    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
    });

    if (result.ScanResult) {
      // Set the scanned class ID to the form field
      setFieldValue("classID", result.ScanResult);
      // Automatically submit the form
      await onSubmit();
    }
  } catch (error) {
    console.error("Scanning failed:", error);
    toast.error("Failed to scan QR code");
  } finally {
    isScanning.value = false;
    document.querySelector("body")?.classList.remove("scanner-active");
  }
};

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  console.log(values);

  await classStore.joinClass(values.classID).then(() => {
    model.value = false;
    isLoading.value = false;
  });
});
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-content {
  animation: slideUp 0.3s ease-out;
}
</style>

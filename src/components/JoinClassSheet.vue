<template>
  <Dialog v-model:open="model">
    <DialogContent class="bg-white text-black">
      <DialogHeader>
        <DialogTitle>Join Class</DialogTitle>
        <DialogDescription>
          Enter a class ID to join an existing class or scan a QR code.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="classID">
          <FormItem>
            <FormLabel>Class ID</FormLabel>
            <FormControl>
              <div class="flex gap-2">
                <Input
                  type="text"
                  placeholder="Class ID"
                  v-bind="componentField"
                />
                <Button
                  type="button"
                  variant="outline"
                  @click="handleScanQR"
                  :loading="isScanning"
                >
                  <QrCodeIcon class="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit" :loading="isLoading">Join Class</Button>
        </DialogFooter>
      </form>
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
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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

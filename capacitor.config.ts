import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eprestasi.app",
  appName: "ePrestasi",
  webDir: "dist",
  server: {
    androidScheme: "http",
    cleartext: true, // Allow cleartext traffic
    allowNavigation: ["*"], // Allow all navigation
  },
  android: {
    allowMixedContent: true, // Allow mixed content
  },
};

export default config;

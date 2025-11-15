import { FontLoader } from "@/components/FontLoader";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar'
export default function RootLayout() {
  return (
    <FontLoader>
     <StatusBar style="dark" backgroundColor="#e5ff00ff"/>
      <Stack screenOptions={{ headerShown: false }} />
    </FontLoader>
  );
}

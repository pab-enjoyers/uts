import { Redirect } from "expo-router";

export default function InitialRedirect() {
  // Auto redirect ke splash screen Syihab
  return <Redirect href="/syihab/splash" />;
}

import { createFileRoute } from "@tanstack/react-router";
import AuthExperience from "@/components/site/AuthExperience";

export const Route = createFileRoute("/auth")({
  component: AuthExperience,
});

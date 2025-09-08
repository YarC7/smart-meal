import { Link } from "react-router-dom";
import Placeholder from "@/components/Placeholder";

export default function Planner() {
  return (
    <Placeholder
      title="Meal Planner"
      description="This page will generate personalized meal plans based on your goals. Ask to implement it next and I'll build it out."
      action={
        <Link
          to="/"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        >
          Back to Home
        </Link>
      }
    />
  );
}

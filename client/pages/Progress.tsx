import { Link } from "react-router-dom";
import Placeholder from "@/components/Placeholder";

export default function Progress() {
  return (
    <Placeholder
      title="Progress"
      description="Track your macros, micro-nutrients, weight trends and daily streaks here."
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

import { ReactNode } from "react";

export default function Placeholder({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className="container mx-auto py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-foreground/70">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </section>
  );
}

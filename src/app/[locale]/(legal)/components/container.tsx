import { cn } from "~/lib/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert container mx-auto px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "../../utils/classname-util";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function PageTitle({ children, className, ...props }: TitleProps) {
  return (
    <h1
      className={cn(
        "text-4xl font-bold tracking-tight mb-2 text-gray-100 sm:text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({ children, className, ...props }: TitleProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-gray-100 sm:text-4xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SubsectionTitle({ children, className, ...props }: TitleProps) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold tracking-tight mb-2 text-gray-100 sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function ArticleTitle({ children, className, ...props }: TitleProps) {
  return (
    <h4
      className={cn(
        "text-xl font-medium tracking-tight text-gray-100 sm:text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Subtitle({ children, className, ...props }: TitleProps) {
  return (
    <h5
      className={cn("text-lg font-medium text-gray-100", className)}
      {...props}
    >
      {children}
    </h5>
  );
}

export function MutedText({ children, className, ...props }: TitleProps) {
  return (
    <p className={cn("text-gray-400 break-all", className)} {...props}>
      {children}
    </p>
  );
}

export function SectionSubheading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-2">
      <h5 className="text-base font-semibold text-gray-200">{title}</h5>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

export function TextExamples() {
  return (
    <div>
      <PageTitle>PageTitle: Welcome to Our Platform</PageTitle>
      <Subtitle>Subtitle: Your one-stop solution for all needs</Subtitle>

      <SectionTitle>SectionTitle: Features</SectionTitle>
      <SubsectionTitle>SubsectionTitle: Core Features</SubsectionTitle>
      <ArticleTitle>ArticleTitle: Real-time Updates</ArticleTitle>
    </div>
  );
}

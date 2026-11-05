

type SectionHeadingProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  // Select the appropriate heading alignment.
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`mb-12 max-w-3xl ${alignment}`}>
      {/* Optional section label. */}
      {label && (
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-(--color-primary)">
          {label}
        </p>
      )}

      {/* Main heading for the section. */}
      <h2 className="text-3xl font-bold text-(--color-foreground) sm:text-4xl">
        {title}
      </h2>

      {/* Optional section description. */}
      {description && (
        <p className="mt-5 text-base leading-8 text-(--color-muted)">
          {description}
        </p>
      )}
    </div>
  );
}

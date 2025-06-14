import { cn } from "@/lib/utils";

export const HighlightTextSearch = ({
  value,
  search,
  className,
}: {
  value?: string | number | null;
  className?: string;
  search: string;
}) => {
  if (!search) return <span>{value ?? ""}</span>;

  const regex = new RegExp(`(${search})`, "gi");
  const parts = String(value)?.split(regex);

  return (
    <span className={cn("", className)}>
      {parts?.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-300/90 text-black"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

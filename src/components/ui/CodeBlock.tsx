import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { useLingui } from "@lingui/react/macro";
import { CopyButton } from "@/components/ui/CopyButton";

/** The plain text of an MDX/Shiki tree: Shiki keeps the line breaks as text nodes between its `span.line`s. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/**
 * The `pre` of every fenced code block in posts and talks, with a copy button
 * in its corner. Clarity showed readers clicking on the commands of the
 * tutorials that bring search traffic, which is selecting text by hand.
 */
export function CodeBlock(props: ComponentProps<"pre">) {
  const { t } = useLingui();
  return (
    <div className="relative">
      <pre {...props} />
      <div className="absolute right-2 top-2">
        <CopyButton
          value={textOf(props.children).replace(/\n$/, "")}
          label={t`Copy`}
          copiedLabel={t`Copied`}
          srLabel={t`Copy code`}
        />
      </div>
    </div>
  );
}

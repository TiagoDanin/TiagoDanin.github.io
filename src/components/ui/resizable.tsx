import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

// react-resizable-panels v4 renamed the primitives (`PanelGroup` -> `Group`,
// `PanelResizeHandle` -> `Separator`) and dropped the
// `data-panel-group-direction` attribute: the group now carries
// `aria-orientation`, so the vertical variants read it from the ancestor.
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group>) => (
  <ResizablePrimitive.Group
    className={cn(
      "flex h-full w-full aria-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [[aria-orientation=vertical]_&]:h-px [[aria-orientation=vertical]_&]:w-full [[aria-orientation=vertical]_&]:after:left-0 [[aria-orientation=vertical]_&]:after:h-1 [[aria-orientation=vertical]_&]:after:w-full [[aria-orientation=vertical]_&]:after:-translate-y-1/2 [[aria-orientation=vertical]_&]:after:translate-x-0 [[aria-orientation=vertical]_&>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

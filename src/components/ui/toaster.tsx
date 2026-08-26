import { useLingui } from "@lingui/react/macro"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { t } = useLingui()
  const { toasts } = useToast()

  return (
    <ToastProvider label={t`Notification`}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport
        // Braces are escaped ICU-style: Lingui parses the message as
        // MessageFormat, so a bare {hotkey} would be read as a placeholder it
        // has no value for and render empty. Radix substitutes the real key.
        label={t`Notifications ('{'hotkey'}')`}
      />
    </ToastProvider>
  )
}

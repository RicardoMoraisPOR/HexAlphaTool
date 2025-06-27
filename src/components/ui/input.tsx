import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMaskito } from '@maskito/react';

interface InputProps extends React.ComponentProps<'input'> {
  hexMask?: boolean;
}

function Input({ className, type, hexMask, ...props }: InputProps) {
  const maskOptions = React.useMemo(
    () =>
      hexMask
        ? {
            mask: [
              '#',
              /[0-9A-Fa-f]/,
              /[0-9A-Fa-f]/,
              /[0-9A-Fa-f]/,
              /[0-9A-Fa-f]/,
              /[0-9A-Fa-f]/,
              /[0-9A-Fa-f]/,
            ],
          }
        : undefined,
    [hexMask]
  );
  const ref = useMaskito({ options: maskOptions });

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (hexMask) {
      const pasted = e.clipboardData.getData('text');
      if (pasted.startsWith('#')) {
        e.preventDefault();
        const valueToInsert = pasted.slice(1);
        const input = e.target as HTMLInputElement;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const currentValue = input.value;
        // Insert the value at the cursor position
        const newValue =
          currentValue.slice(0, start) +
          valueToInsert +
          currentValue.slice(end);
        input.value = newValue;
        // Move cursor to the end of the inserted value
        const cursorPos = start + valueToInsert.length;
        input.setSelectionRange(cursorPos, cursorPos);
        // Trigger input event for React
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
    // Otherwise, default paste
  };

  return (
    <input
      ref={hexMask ? ref : undefined}
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      onPaste={handlePaste}
      {...props}
    />
  );
}

export { Input };

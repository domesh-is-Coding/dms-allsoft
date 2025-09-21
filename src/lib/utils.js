// Utility function for conditional class names (shadcn/ui standard)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

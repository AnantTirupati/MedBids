export function truncateText(text: string, length = 30): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

export function formatPincode(pincode: string): string {
  const cleaned = pincode.replace(/\D/g, "");
  return cleaned.substring(0, 6);
}
export default truncateText;

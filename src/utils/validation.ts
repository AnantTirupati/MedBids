export function validatePhone(phone: string): boolean {
  // Matches Indian phone number formats
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10;
}

export function validateOTP(otp: string): boolean {
  return otp.replace(/\D/g, "").length === 6;
}

export function validateLicense(licenseNumber: string): boolean {
  return licenseNumber.trim().length >= 8;
}

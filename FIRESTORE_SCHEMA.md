# Firestore Schema & Collection Layouts

This document lists the structure of the Collections used by MedBids in Google Cloud Firestore.

---

## Collections List

### 1. `users` (Patient Profiles)
*   **Path:** `/users/{userId}`
*   **Key Fields:**
    *   `id`: `string` (Auth UID)
    *   `email`: `string`
    *   `full_name`: `string`
    *   `phone`: `string`
    *   `role`: `"patient"` | `"admin"`
    *   `is_active`: `boolean`

### 2. `pharmacies` (Pharmacy Profiles)
*   **Path:** `/pharmacies/{pharmacyId}`
*   **Key Fields:**
    *   `id`: `string` (Auth UID)
    *   `pharmacy_name`: `string`
    *   `license_number`: `string`
    *   `verification_status`: `"pending"` | `"approved"` | `"rejected"` | `"suspended"`
    *   `is_active`: `boolean`

### 3. `prescriptions` (Uploaded Rx Room Documents)
*   **Path:** `/prescriptions/{rxId}`
*   **Key Fields:**
    *   `id`: `string`
    *   `patient_id`: `string`
    *   `status`: `PrescriptionStatus`
    *   `prescription_image_url`: `string | null`
    *   `auction_id`: `string | null`

### 4. `auctions` (Live Auction Rooms)
*   **Path:** `/auctions/{auctionId}`
*   **Key Fields:**
    *   `id`: `string`
    *   `prescription_id`: `string`
    *   `status`: `"live"` | `"ended"` | `"cancelled"`
    *   `lowest_bid`: `number | null`
    *   `end_time`: `string` (ISO Timestamp)

### 5. `bids` (Bids Submissions)
*   **Path:** `/bids/{bidId}`
*   **Key Fields:**
    *   `id`: `string`
    *   `auction_id`: `string`
    *   `pharmacy_id`: `string`
    *   `amount`: `number`
    *   `status`: `"active"` | `"outbid"` | `"won"` | `"lost"`

### 6. `offers` (Bid offers accepted)
*   **Path:** `/offers/{offerId}`

### 7. `reservations` (Pickup Reservations)
*   **Path:** `/reservations/{resId}`

### 8. `notifications` (In-App Alerts)
*   **Path:** `/notifications/{notifId}`

### 9. `notification_preferences` (Channel preferences)
*   **Path:** `/notification_preferences/{userId}`

### 10. `device_tokens` (FCM Device registration)
*   **Path:** `/device_tokens/{tokenId}`

### 11. `audit_logs` (Admin transaction history)
*   **Path:** `/audit_logs/{logId}`

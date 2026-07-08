process.env.NEXT_PUBLIC_USE_FIREBASE = "mock";
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyDummyKeyForTestingPurposesOnly123";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "dummy-auth-domain";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "dummy-project-id";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "dummy-storage-bucket";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "1234567890";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:1234567890:web:123456";

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

async function runTests() {
  console.log("\n==============================================");
  console.log("RUNNING MEDBIDS SYSTEM VERIFICATION SUITE...");
  console.log("==============================================\n");

  try {
    // Dynamic imports to prevent ESM import hoisting issues
    const { patientService } = await import("../src/services/patient.service");
    const { moderationService } = await import("../src/services/moderation.service");
    const { notificationService } = await import("../src/services/notification.service");
    const { notificationEngineService } = await import("../src/features/notification-engine/notification-engine.service");
    const { auctionEngineService } = await import("../src/features/auction-engine/auction-engine.service");
    const { PrescriptionStatus, BidStatus } = await import("../src/types");

    // Test 1: Patient Login
    console.log("[Test Suite] Authenticating patient...");
    const { patientRepository, pharmacyRepository } = await import("../src/repositories");
    const patient = await patientRepository.getPatientById("p1");
    assert(patient !== null && patient.role === "patient", "Patient profile authenticated successfully");

    // Test 2: Pharmacy Login
    console.log("[Test Suite] Authenticating pharmacy...");
    const pharmacy = await pharmacyRepository.getPharmacyById("pharm1");
    assert(pharmacy !== null && pharmacy.role === "pharmacy", "Pharmacy profile authenticated successfully");

    // Test 3: Upload Prescription & Create Auction Room
    console.log("[Test Suite] Creating prescription and verified auction...");
    const rx = await patientService.uploadPrescription(
      "p1",
      "Anant Tirupati",
      "Take daily before meals",
      [
        {
          name: "Insulin Humalog",
          generic_name: "Insulin Lispro 100IU/ml",
          dosage: "10 units before breakfast",
          form: "Pre-filled Pen",
          quantity: 3,
          frequency: "Once daily",
        },
      ]
    );
    assert(rx !== null && rx.status === PrescriptionStatus.PENDING_VERIFICATION, "Prescription uploaded successfully to pending moderation status");

    // Test 4: Moderate Prescription & Start Live Auction Room
    console.log("[Test Suite] Simulating admin verification and auction start...");
    const verifiedRx = await moderationService.approvePrescription(rx.id, "admin1", 24);
    assert(verifiedRx !== null && verifiedRx.status === PrescriptionStatus.AUCTION_LIVE, "Prescription verified and auction set to live status");
    assert(verifiedRx.auction_id !== null, "Live Auction ID assigned to prescription");

    // Test 5: Submit Bid
    console.log("[Test Suite] Submitting competitive pharmacy bids...");
    const bidAmount = 450;
    const bid = await auctionEngineService.submitBid(
      verifiedRx.auction_id!,
      "pharm1",
      bidAmount,
      "Delivered within 2 hours",
      "Includes free consultation"
    );
    assert(bid !== null && bid.amount === bidAmount && bid.status === BidStatus.ACTIVE, "Pharmacy submits active bid quote successfully");

    // Test 6: Auto Award Winner recs
    console.log("[Test Suite] Recalculating auction metrics...");
    const { auctionRepository } = await import("../src/repositories");
    const updatedAuction = await auctionRepository.getAuctionById(verifiedRx.auction_id!);
    assert(updatedAuction !== null && updatedAuction.lowest_bid === bidAmount, "Lowest bid calculated and populated correctly");

    // Test 7: Verify Notification Dispatcher
    console.log("[Test Suite] Verifying live notification triggers...");
    await notificationEngineService.sendNotification(
      "p1",
      "bid_received",
      "New Bid Received!",
      "A new pharmacy bid has been placed on your prescription room for ₹{amount}.",
      { amount: bidAmount.toString() },
      "bid"
    );
    const notifications = await notificationService.getNotifications("p1");
    assert(notifications.length > 0, "Notification delivery logged to database");
    assert(notifications[notifications.length - 1].title === "New Bid Received!", "Notification title formatted and delivered");

    console.log("\n==============================================");
    console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
    console.log("==============================================\n");

    if (passedTests < totalTests) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test runner encountered unexpected failure:", err);
    process.exit(1);
  }
}

runTests();

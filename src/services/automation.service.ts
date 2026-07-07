import { auctionRepository, bidRepository } from "@/repositories";
import { notificationEngineService } from "@/features/notification-engine/notification-engine.service";
import { NotificationCategory } from "@/features/notification-engine/notification-engine.constants";

export const automationService = {
  async runAuctionReminderJob(): Promise<number> {
    console.log("[Automation Job] Running Auction Expiry/Reminder check...");
    const auctions = await auctionRepository.getAuctions();
    const now = new Date().getTime();
    let remindersSent = 0;

    for (const auction of auctions) {
      if (auction.status === "live") {
        const endTime = new Date(auction.end_time).getTime();
        const diffMinutes = Math.floor((endTime - now) / (1000 * 60));

        // If ending within 15 minutes, notify patient and bidders
        if (diffMinutes > 0 && diffMinutes <= 15) {
          // Notify patient
          await notificationEngineService.sendNotification(
            auction.prescription.patient_id,
            "auction_ending",
            "Auction Room Ending Soon!",
            "Your prescription auction for {medication} is ending in {minutes} minutes. Review current bids now.",
            { medication: auction.prescription.medications[0]?.name || "prescriptions", minutes: diffMinutes.toString() },
            NotificationCategory.AUCTION
          );
          
          // Notify bidders
          const bids = await bidRepository.getBidsByAuctionId(auction.id);
          for (const bid of bids) {
            if (bid.status === "active") {
              await notificationEngineService.sendNotification(
                bid.pharmacy_id,
                "auction_ending",
                "Auction Room Expiring Soon",
                "The auction for Rx #{rxId} is ending in {minutes} minutes. Review your bid of ₹{amount} now.",
                { rxId: auction.prescription_id, minutes: diffMinutes.toString(), amount: bid.amount.toString() },
                NotificationCategory.AUCTION
              );
            }
          }
          remindersSent++;
        }
      }
    }
    return remindersSent;
  },

  async runOrphanCleanUpJob(): Promise<void> {
    console.log("[Automation Job] Running Orphan Storage and Expired Session Clean-up...");
    // Mock cleanup log
  },
};

export default automationService;

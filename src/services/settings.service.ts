import { settingsRepository } from "@/repositories";
import { PlatformSettings } from "@/types";
import { auditService } from "./audit.service";

export const settingsService = {
  async getSettings(): Promise<PlatformSettings> {
    return settingsRepository.getPlatformSettings();
  },

  async updateSettings(settings: PlatformSettings, reviewerId: string): Promise<PlatformSettings> {
    // Basic validation
    if (settings.commissionRate < 0 || settings.commissionRate > 1) {
      throw new Error("Commission rate must be between 0 and 1");
    }
    if (settings.auctionDurationHours <= 0) {
      throw new Error("Auction duration must be a positive number of hours");
    }

    const before = await settingsRepository.getPlatformSettings();
    const updated = await settingsRepository.updatePlatformSettings(settings);

    await auditService.createLog(
      reviewerId,
      "admin",
      "Update Platform Settings",
      "settings",
      "platform",
      JSON.parse(JSON.stringify(before)),
      JSON.parse(JSON.stringify(updated))
    );

    return updated;
  },

  subscribeSettings(callback: (settings: PlatformSettings) => void): () => void {
    return settingsRepository.subscribePlatformSettings(callback);
  },
};

export default settingsService;

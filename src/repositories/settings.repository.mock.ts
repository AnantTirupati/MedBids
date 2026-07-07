import { SettingsRepository } from "./interfaces/settings.repository";
import { mockPlatformSettings } from "@/lib/mock-data/settings";
import { PlatformSettings } from "@/types";
const listeners: Set<(settings: PlatformSettings) => void> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => cb({ ...mockPlatformSettings }));
}

export const settingsRepositoryMock: SettingsRepository = {
  async getPlatformSettings(): Promise<PlatformSettings> {
    return mockPlatformSettings;
  },

  async updatePlatformSettings(settings: PlatformSettings): Promise<PlatformSettings> {
    mockPlatformSettings.commissionRate = settings.commissionRate;
    mockPlatformSettings.auctionDurationHours = settings.auctionDurationHours;
    mockPlatformSettings.maxBidsPerAuction = settings.maxBidsPerAuction;
    mockPlatformSettings.minTimeLeftToExtendMinutes = settings.minTimeLeftToExtendMinutes;
    notifyListeners();
    return mockPlatformSettings;
  },

  subscribePlatformSettings(callback: (settings: PlatformSettings) => void): () => void {
    listeners.add(callback);
    callback({ ...mockPlatformSettings });
    return () => {
      listeners.delete(callback);
    };
  },
};

export default settingsRepositoryMock;

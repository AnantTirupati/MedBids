import { DeviceTokenRepository } from "@/features/notification-engine/notification-engine.repository";
import { DeviceToken } from "@/features/notification-engine/notification-engine.types";

const mockTokens: DeviceToken[] = [];
const listeners: Map<string, Set<(tokens: DeviceToken[]) => void>> = new Map();

function notifyListeners(userId: string) {
  const set = listeners.get(userId);
  if (set) {
    const filtered = mockTokens.filter((t) => t.userId === userId);
    set.forEach((cb) => cb([...filtered]));
  }
}

export const deviceTokenRepositoryMock: DeviceTokenRepository = {
  async registerDevice(token: DeviceToken): Promise<DeviceToken> {
    const idx = mockTokens.findIndex((t) => t.userId === token.userId && t.token === token.token);
    if (idx !== -1) {
      mockTokens[idx] = { ...mockTokens[idx], ...token, lastUsedAt: new Date().toISOString() };
    } else {
      mockTokens.push(token);
    }
    notifyListeners(token.userId);
    return token;
  },

  async removeDevice(userId: string, token: string): Promise<void> {
    const idx = mockTokens.findIndex((t) => t.userId === userId && t.token === token);
    if (idx !== -1) {
      mockTokens.splice(idx, 1);
      notifyListeners(userId);
    }
  },

  async getUserDevices(userId: string): Promise<DeviceToken[]> {
    return mockTokens.filter((t) => t.userId === userId);
  },

  subscribeUserDevices(userId: string, callback: (tokens: DeviceToken[]) => void): () => void {
    let set = listeners.get(userId);
    if (!set) {
      set = new Set();
      listeners.set(userId, set);
    }
    set.add(callback);
    callback(mockTokens.filter((t) => t.userId === userId));
    return () => {
      set?.delete(callback);
    };
  },
};

export default deviceTokenRepositoryMock;

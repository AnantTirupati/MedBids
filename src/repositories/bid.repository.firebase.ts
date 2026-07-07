import { BidRepository } from "./interfaces/bid.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Bid, Auction, BidStatus } from "@/types";
import { doc, getDoc, getDocs, collection, query, where, setDoc, runTransaction, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const bidRepositoryFirebase: BidRepository = {
  async getBids(): Promise<Bid[]> {
    try {
      const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getBidById(id: string): Promise<Bid | null> {
    try {
      const docRef = doc(db, Collections.BIDS, id).withConverter(createConverter<Bid>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getBidsByAuctionId(auctionId: string): Promise<Bid[]> {
    try {
      const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(colRef, where("auction_id", "==", auctionId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getBidsByPharmacyId(pharmacyId: string): Promise<Bid[]> {
    try {
      const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(colRef, where("pharmacy_id", "==", pharmacyId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createBid(bid: Bid): Promise<Bid> {
    try {
      const docRef = doc(db, Collections.BIDS, bid.id).withConverter(createConverter<Bid>());
      await setDoc(docRef, bid);
      return bid;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateBid(bid: Bid): Promise<Bid> {
    try {
      const docRef = doc(db, Collections.BIDS, bid.id).withConverter(createConverter<Bid>());
      await setDoc(docRef, bid, { merge: true });
      return bid;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createBidTransaction(bid: Bid): Promise<Bid> {
    try {
      await runTransaction(db, async (transaction) => {
        const auctionRef = doc(db, Collections.AUCTIONS, bid.auction_id).withConverter(createConverter<Auction>());
        const auctionSnap = await transaction.get(auctionRef);
        if (!auctionSnap.exists()) {
          throw new Error("Auction not found");
        }
        const auction = auctionSnap.data();
        if (auction.status !== "live") {
          throw new Error("Auction is no longer active");
        }

        if (auction.lowest_bid && bid.amount >= auction.lowest_bid) {
          throw new Error("Bid amount must be lower than the current lowest bid");
        }

        const bidRef = doc(db, Collections.BIDS, bid.id).withConverter(createConverter<Bid>());
        transaction.set(bidRef, bid);

        transaction.update(auctionRef, {
          total_bids: (auction.total_bids || 0) + 1,
          lowest_bid: bid.amount,
        });
      });
      return bid;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateBidTransaction(bidId: string, amount: number): Promise<Bid> {
    try {
      const bidRef = doc(db, Collections.BIDS, bidId).withConverter(createConverter<Bid>());
      const bidSnap = await getDoc(bidRef);
      if (!bidSnap.exists()) {
        throw new Error("Bid not found");
      }
      const bid = bidSnap.data();

      // Query other active bids to calculate lowest_bid
      const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(colRef, where("auction_id", "==", bid.auction_id), where("status", "==", "active"));
      const snap = await getDocs(q);
      const otherBids = snap.docs.map((d) => d.data()).filter((b) => b.id !== bidId);
      const newLowest = otherBids.length > 0 ? Math.min(amount, ...otherBids.map((b) => b.amount)) : amount;

      let updatedBid: Bid | null = null;
      await runTransaction(db, async (transaction) => {
        const auctionRef = doc(db, Collections.AUCTIONS, bid.auction_id).withConverter(createConverter<Auction>());
        const auctionSnap = await transaction.get(auctionRef);
        if (!auctionSnap.exists()) {
          throw new Error("Auction not found");
        }
        const auction = auctionSnap.data();
        if (auction.status !== "live") {
          throw new Error("Auction is no longer active");
        }

        if (auction.lowest_bid && amount >= auction.lowest_bid && bid.amount !== auction.lowest_bid) {
          throw new Error("Bid amount must be lower than the current lowest bid");
        }

        bid.amount = amount;
        bid.updated_at = new Date().toISOString();
        transaction.set(bidRef, bid, { merge: true });
        transaction.update(auctionRef, { lowest_bid: newLowest });
        updatedBid = bid;
      });
      return updatedBid!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async withdrawBidTransaction(bidId: string): Promise<Bid> {
    try {
      const bidRef = doc(db, Collections.BIDS, bidId).withConverter(createConverter<Bid>());
      const bidSnap = await getDoc(bidRef);
      if (!bidSnap.exists()) {
        throw new Error("Bid not found");
      }
      const bid = bidSnap.data();

      // Query other active bids to calculate lowest_bid
      const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(colRef, where("auction_id", "==", bid.auction_id), where("status", "==", "active"));
      const snap = await getDocs(q);
      const remainingBids = snap.docs.map((d) => d.data()).filter((b) => b.id !== bidId);
      const newLowest = remainingBids.length > 0 ? Math.min(...remainingBids.map((b) => b.amount)) : null;

      let updatedBid: Bid | null = null;
      await runTransaction(db, async (transaction) => {
        const auctionRef = doc(db, Collections.AUCTIONS, bid.auction_id).withConverter(createConverter<Auction>());
        const auctionSnap = await transaction.get(auctionRef);
        if (!auctionSnap.exists()) {
          throw new Error("Auction not found");
        }
        const auction = auctionSnap.data();

        bid.status = BidStatus.WITHDRAWN;
        bid.updated_at = new Date().toISOString();
        transaction.set(bidRef, bid, { merge: true });

        const newTotalBids = Math.max(0, (auction.total_bids || 1) - 1);
        transaction.update(auctionRef, {
          total_bids: newTotalBids,
          lowest_bid: newLowest,
        });
        updatedBid = bid;
      });
      return updatedBid!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
  subscribeBidsByAuctionId(auctionId: string, callback: (bids: Bid[]) => void): () => void {
    const colRef = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
    const q = query(colRef, where("auction_id", "==", auctionId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default bidRepositoryFirebase;

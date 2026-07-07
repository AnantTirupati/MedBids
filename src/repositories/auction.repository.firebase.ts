import { AuctionRepository } from "./interfaces/auction.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Auction } from "@/types";
import { doc, getDoc, getDocs, collection, setDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const auctionRepositoryFirebase: AuctionRepository = {
  async getAuctions(): Promise<Auction[]> {
    try {
      const colRef = collection(db, Collections.AUCTIONS).withConverter(createConverter<Auction>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getAuctionById(id: string): Promise<Auction | null> {
    try {
      const docRef = doc(db, Collections.AUCTIONS, id).withConverter(createConverter<Auction>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createAuction(auction: Auction): Promise<Auction> {
    try {
      const docRef = doc(db, Collections.AUCTIONS, auction.id).withConverter(createConverter<Auction>());
      await setDoc(docRef, auction);
      return auction;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateAuction(auction: Auction): Promise<Auction> {
    try {
      const docRef = doc(db, Collections.AUCTIONS, auction.id).withConverter(createConverter<Auction>());
      await setDoc(docRef, auction, { merge: true });
      return auction;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeAuctions(callback: (auctions: Auction[]) => void): () => void {
    const colRef = collection(db, Collections.AUCTIONS).withConverter(createConverter<Auction>());
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },

  subscribeAuctionById(id: string, callback: (auction: Auction | null) => void): () => void {
    const docRef = doc(db, Collections.AUCTIONS, id).withConverter(createConverter<Auction>());
    return onSnapshot(docRef, (snap) => {
      callback(snap.exists() ? snap.data() : null);
    });
  },
};

export default auctionRepositoryFirebase;

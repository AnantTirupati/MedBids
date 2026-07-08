import { AuctionEngineRepository } from "./interfaces/auction-engine.repository";
import { Auction, Bid, Offer, Reservation, PrescriptionStatus, AuctionStatus, OfferStatus, Prescription, BidStatus, ReservationStatus } from "@/types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { doc, getDoc, getDocs, collection, query, where, setDoc, runTransaction } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const auctionEngineRepositoryFirebase: AuctionEngineRepository = {
  async startAuction(prescriptionId: string, durationHours: number): Promise<Auction> {
    try {
      const rxRef = doc(db, Collections.PRESCRIPTIONS, prescriptionId).withConverter(createConverter<Prescription>());
      const auctionId = `a_${Math.random().toString(36).substr(2, 9)}`;
      const auctionRef = doc(db, Collections.AUCTIONS, auctionId).withConverter(createConverter<Auction>());
      
      let auction: Auction | null = null;
      await runTransaction(db, async (transaction) => {
        const rxSnap = await transaction.get(rxRef);
        if (!rxSnap.exists()) throw new Error("Prescription not found");
        const rx = rxSnap.data();
        
        const now = new Date();
        const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
        
        auction = {
          id: auctionId,
          prescription_id: prescriptionId,
          prescription: rx,
          status: AuctionStatus.LIVE,
          start_time: now.toISOString(),
          end_time: endTime.toISOString(),
          duration_minutes: durationHours * 60,
          total_bids: 0,
          lowest_bid: null,
          highest_bid: null,
          created_at: now.toISOString(),
        };
        
        transaction.set(auctionRef, auction);
        transaction.update(rxRef, { 
          status: PrescriptionStatus.AUCTION_LIVE,
          auction_id: auctionId 
        });
      });
      return auction!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async closeAuction(auctionId: string): Promise<{ auction: Auction; offer: Offer | null; reservation: Reservation | null }> {
    try {
      const bidsCol = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const bidsQuery = query(bidsCol, where("auction_id", "==", auctionId), where("status", "==", "active"));
      const bidsSnap = await getDocs(bidsQuery);
      const activeBids = bidsSnap.docs.map((d) => d.data());

      let result: { auction: Auction; offer: Offer | null; reservation: Reservation | null } | null = null;

      await runTransaction(db, async (transaction) => {
        const auctionRef = doc(db, Collections.AUCTIONS, auctionId).withConverter(createConverter<Auction>());
        const auctionSnap = await transaction.get(auctionRef);
        if (!auctionSnap.exists()) throw new Error("Auction not found");
        const auction = auctionSnap.data();

        if (auction.status !== AuctionStatus.LIVE) {
          throw new Error("Auction is already closed");
        }

        const rxRef = doc(db, Collections.PRESCRIPTIONS, auction.prescription_id).withConverter(createConverter<Prescription>());
        const rxSnap = await transaction.get(rxRef);
        if (!rxSnap.exists()) throw new Error("Prescription not found");
        const rx = rxSnap.data();

        if (activeBids.length === 0) {
          transaction.update(auctionRef, { status: AuctionStatus.ENDED });
          transaction.update(rxRef, { status: PrescriptionStatus.VERIFIED });
          result = {
            auction: { ...auction, status: AuctionStatus.ENDED, prescription: rx },
            offer: null,
            reservation: null,
          };
          return;
        }

        activeBids.sort((a, b) => a.amount - b.amount);
        const winningBid = activeBids[0];
        const autoAward = true;

        const offerId = `o_${Math.random().toString(36).substr(2, 9)}`;
        const offerRef = doc(db, Collections.OFFERS, offerId).withConverter(createConverter<Offer>());

        const offer: Offer = {
          id: offerId,
          bid_id: winningBid.id,
          auction_id: auctionId,
          prescription_id: auction.prescription_id,
          patient_id: rx.patient_id,
          pharmacy_id: winningBid.pharmacy_id,
          pharmacy_name: winningBid.pharmacy_name,
          pharmacy_avatar: winningBid.pharmacy_avatar,
          pharmacy_rating: winningBid.pharmacy_rating,
          amount: winningBid.amount,
          delivery_time: winningBid.delivery_time,
          medications: rx.medications,
          status: autoAward ? OfferStatus.ACCEPTED : OfferStatus.OPEN,
          created_at: new Date().toISOString(),
          accepted_at: autoAward ? new Date().toISOString() : null,
          fulfilled_at: null,
        };

        transaction.set(offerRef, offer);
        transaction.update(auctionRef, { status: AuctionStatus.ENDED });

        let reservation: Reservation | null = null;
        if (autoAward) {
          const resId = `r_${Math.random().toString(36).substr(2, 9)}`;
          const resRef = doc(db, Collections.RESERVATIONS, resId).withConverter(createConverter<Reservation>());
          
          reservation = {
            id: resId,
            offer_id: offer.id,
            patient_id: offer.patient_id,
            pharmacy_id: offer.pharmacy_id,
            status: ReservationStatus.PENDING,
            pickup_code: Math.floor(1000 + Math.random() * 9000).toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          transaction.set(resRef, reservation);
          transaction.update(rxRef, { status: PrescriptionStatus.OFFER_ACCEPTED });
        } else {
          transaction.update(rxRef, { status: PrescriptionStatus.AUCTION_ENDED });
        }

        activeBids.forEach((b) => {
          const bRef = doc(db, Collections.BIDS, b.id).withConverter(createConverter<Bid>());
          if (b.id === winningBid.id) {
            transaction.update(bRef, { status: BidStatus.WON });
          } else {
            transaction.update(bRef, { status: BidStatus.LOST });
          }
        });

        result = {
          auction: { ...auction, status: AuctionStatus.ENDED, prescription: rx },
          offer,
          reservation,
        };
      });

      return result!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getLowestBid(auctionId: string): Promise<Bid | null> {
    try {
      const bidsCol = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(bidsCol, where("auction_id", "==", auctionId), where("status", "==", "active"));
      const snap = await getDocs(q);
      const bids = snap.docs.map((d) => d.data());
      if (bids.length === 0) return null;
      bids.sort((a, b) => a.amount - b.amount);
      return bids[0];
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async calculateWinner(auctionId: string): Promise<Bid | null> {
    return this.getLowestBid(auctionId);
  },

  async acceptWinningOffer(offerId: string): Promise<{ offer: Offer; reservation: Reservation }> {
    try {
      const offerRef = doc(db, Collections.OFFERS, offerId).withConverter(createConverter<Offer>());
      const resId = `r_${Math.random().toString(36).substr(2, 9)}`;
      const resRef = doc(db, Collections.RESERVATIONS, resId).withConverter(createConverter<Reservation>());

      let result: { offer: Offer; reservation: Reservation } | null = null;
      await runTransaction(db, async (transaction) => {
        const offerSnap = await transaction.get(offerRef);
        if (!offerSnap.exists()) throw new Error("Offer not found");
        const offer = offerSnap.data();

        const rxRef = doc(db, Collections.PRESCRIPTIONS, offer.prescription_id).withConverter(createConverter<Prescription>());
        const auctionRef = doc(db, Collections.AUCTIONS, offer.auction_id).withConverter(createConverter<Auction>());

        const reservation: Reservation = {
          id: resId,
          offer_id: offer.id,
          patient_id: offer.patient_id,
          pharmacy_id: offer.pharmacy_id,
          status: ReservationStatus.PENDING,
          pickup_code: Math.floor(1000 + Math.random() * 9000).toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        offer.status = OfferStatus.ACCEPTED;
        offer.accepted_at = new Date().toISOString();

        transaction.set(offerRef, offer);
        transaction.set(resRef, reservation);
        transaction.update(rxRef, { status: PrescriptionStatus.OFFER_ACCEPTED });
        transaction.update(auctionRef, { status: AuctionStatus.ENDED });

        result = { offer, reservation };
      });
      return result!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async recalculateAuction(auctionId: string): Promise<Auction> {
    try {
      const bidsCol = collection(db, Collections.BIDS).withConverter(createConverter<Bid>());
      const q = query(bidsCol, where("auction_id", "==", auctionId), where("status", "==", "active"));
      const snap = await getDocs(q);
      const bids = snap.docs.map((d) => d.data());

      let lowestBid: number | null = null;
      if (bids.length > 0) {
        bids.sort((a, b) => a.amount - b.amount);
        lowestBid = bids[0].amount;
      }

      const auctionRef = doc(db, Collections.AUCTIONS, auctionId).withConverter(createConverter<Auction>());
      await setDoc(auctionRef, {
        total_bids: bids.length,
        lowest_bid: lowestBid,
      }, { merge: true });

      const updatedSnap = await getDoc(auctionRef);
      return updatedSnap.data()!;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default auctionEngineRepositoryFirebase;

import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function sendFriendRequest(myUid, theirUid) {
  if (!myUid || !theirUid) {
    throw new Error("Invalid UIDs for friend request");
  }
  if (myUid === theirUid) {
    throw new Error("You cannot friend yourself");
  }

  const updates = {};

  // You → Them (outgoing)
  updates[`friendRequestsOutgoing/${myUid}/${theirUid}`] = true;

  // Them → You (incoming)
  updates[`friendRequestsIncoming/${theirUid}/${myUid}`] = true;

  await update(ref(database), updates);
}

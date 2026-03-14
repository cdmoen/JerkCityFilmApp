import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function rejectFriendRequest(myUid, otherUid) {
  const updates = {};

  // Remove the 'incoming' request from your user account
  updates[`friendRequestsIncoming/${myUid}/${otherUid}`] = null;

  // remove the 'outgoing' request from the other user's account
  updates[`friendRequestsOutgoing/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

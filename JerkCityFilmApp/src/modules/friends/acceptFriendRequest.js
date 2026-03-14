import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function acceptFriendRequest(myUid, otherUid) {
  const updates = {};

  // add the new friend's uid to your friends node
  updates[`friends/${myUid}/${otherUid}`] = true;

  // add your uid to the new friend's friends node
  updates[`friends/${otherUid}/${myUid}`] = true;

  // clear the 'incoming' request node from friend's account
  updates[`friendRequestsIncoming/${myUid}/${otherUid}`] = null;

  // clear the 'outgoing' request node from your account
  updates[`friendRequestsOutgoing/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

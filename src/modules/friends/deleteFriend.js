import { database } from "../firebase";
import { ref, update, get } from "firebase/database";

export async function deleteFriend(myUid, otherUid) {
  if (!myUid || !otherUid) {
    throw new Error("Invalid UIDs for deleting friend");
  }

  const updates = {};

  // Remove each side of the mutual friendship
  updates[`friends/${myUid}/${otherUid}`] = null;
  updates[`friends/${otherUid}/${myUid}`] = null;

  // --- Incoming Group Invites ---

  // Check myUid's incoming group invites for any sent by otherUid
  const myIncomingSnap = await get(
    ref(database, `groupInvitesIncoming/${myUid}`),
  );
  const myIncoming = myIncomingSnap.val() || {};
  for (const groupId in myIncoming) {
    if (myIncoming[groupId].from === otherUid) {
      updates[`groupInvitesIncoming/${myUid}/${groupId}`] = null;
    }
  }

  // Check otherUid's incoming group invites for any sent by myUid
  const otherIncomingSnap = await get(
    ref(database, `groupInvitesIncoming/${otherUid}`),
  );
  const otherIncoming = otherIncomingSnap.val() || {};
  for (const groupId in otherIncoming) {
    if (otherIncoming[groupId].from === myUid) {
      updates[`groupInvitesIncoming/${otherUid}/${groupId}`] = null;
    }
  }

  // --- Outgoing Group invites ---

  // Check myUid's pending outoging group invites for any sent to otherUid
  const myOutgoingSnap = await get(
    ref(database, `groupInvitesOutgoing/${myUid}`),
  );
  const myOutgoing = myOutgoingSnap.val() || {};
  for (const groupId in myOutgoing) {
    if (myOutgoing[groupId][otherUid]) {
      updates[`groupInvitesOutgoing/${myUid}/${groupId}/${otherUid}`] = null;
    }
  }

  // Check otherUid's pending outgoing group invites for any sent to myUid
  const otherOutgoingSnap = await get(
    ref(database, `groupInvitesOutgoing/${otherUid}`),
  );
  const otherOutgoing = otherOutgoingSnap.val() || {};
  for (const groupId in otherOutgoing) {
    if (otherOutgoing[groupId][myUid]) {
      updates[`groupInvitesOutgoing/${otherUid}/${groupId}/${myUid}`] = null;
    }
  }

  await update(ref(database), updates);
}

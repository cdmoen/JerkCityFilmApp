import { database } from "../firebase";
import { ref, update, get } from "firebase/database";

export async function acceptGroupInvite(uid, groupId) {
  const updates = {};

  // Add member
  updates[`groups/${groupId}/members/${uid}`] = true;
  updates[`users/${uid}/groups/${groupId}`] = true;

  // Read the incoming invite to get the inviter UID
  const incomingSnap = await get(
    ref(database, `groupInvitesIncoming/${uid}/${groupId}`),
  );

  let inviterUid = null;
  if (incomingSnap.exists()) {
    inviterUid = incomingSnap.val().from;
  }

  // Remove incoming invite
  updates[`groupInvitesIncoming/${uid}/${groupId}`] = null;

  // Remove outgoing invite (only one inviter)
  if (inviterUid) {
    updates[`groupInvitesOutgoing/${inviterUid}/${groupId}/${uid}`] = null;
  }

  await update(ref(database), updates);
}

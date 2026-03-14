import { database } from "../firebase";
import { ref, update, get } from "firebase/database";

export async function rejectGroupInvite(uid, groupId) {
  if (!uid || !groupId) {
    throw new Error("Invalid arguments for rejectGroupInvite");
  }

  const updates = {};

  // Remove incoming invite
  updates[`groupInvitesIncoming/${uid}/${groupId}`] = null;

  // Remove outgoing invites from any inviter
  const snap = await get(ref(database, `groupInvitesOutgoing`));

  if (snap.exists()) {
    const allOutgoing = snap.val();

    for (const inviterUid in allOutgoing) {
      if (allOutgoing[inviterUid][groupId]?.[uid]) {
        updates[`groupInvitesOutgoing/${inviterUid}/${groupId}/${uid}`] = null;
      }
    }
  }

  await update(ref(database), updates);
}

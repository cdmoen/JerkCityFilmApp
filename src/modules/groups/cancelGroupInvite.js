import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function cancelGroupInvite(fromUid, groupId, toUid) {
  if (!fromUid || !groupId || !toUid) {
    throw new Error("Invalid arguments for cancelGroupInvite");
  }

  const updates = {};

  // Remove outgoing invite
  updates[`groupInvitesOutgoing/${fromUid}/${groupId}/${toUid}`] = null;

  // Remove incoming invite
  updates[`groupInvitesIncoming/${toUid}/${groupId}`] = null;

  await update(ref(database), updates);
}

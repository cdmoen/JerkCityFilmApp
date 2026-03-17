import { database } from "../firebase";
import { ref, get, update } from "firebase/database";

export async function deleteGroup(groupId, uid) {
  if (!groupId || !uid) throw new Error("Missing groupId or uid");

  const updates = {};

  try {
    // Delete the group itself
    updates[`groups/${groupId}`] = null;

    // Remove group from ALL members' user profiles
    const membersSnap = await get(ref(database, `groups/${groupId}/members`));
    const members = membersSnap.val() || {};

    for (const memberUid of Object.keys(members)) {
      updates[`users/${memberUid}/groups/${groupId}`] = null;
    }

    // Remove all incoming invites for this group
    const incomingSnap = await get(ref(database, `groupInvitesIncoming`));
    const incoming = incomingSnap.val() || {};

    for (const userId in incoming) {
      if (incoming[userId][groupId]) {
        updates[`groupInvitesIncoming/${userId}/${groupId}`] = null;
      }
    }

    // Remove all outgoing invites for this group
    const outgoingSnap = await get(ref(database, `groupInvitesOutgoing`));
    const outgoing = outgoingSnap.val() || {};

    for (const inviterUid in outgoing) {
      if (outgoing[inviterUid][groupId]) {
        updates[`groupInvitesOutgoing/${inviterUid}/${groupId}`] = null;
      }
    }

    // Commit all deletions in one atomic update
    await update(ref(database), updates);

    return true;
  } catch (err) {
    console.error("Error deleting group:", err);
    throw err;
  }
}

import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function leaveGroup(uid, groupId) {
  if (!uid || !groupId) throw new Error("Invalid arguments for leaveGroup");

  const updates = {};
  updates[`groups/${groupId}/members/${uid}`] = null;
  updates[`users/${uid}/groups/${groupId}`] = null;

  await update(ref(database), updates);
}

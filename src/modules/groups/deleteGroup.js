import { database } from "../firebase";
import { ref, remove } from "firebase/database";

export async function deleteGroup(groupId, uid) {
  if (!groupId || !uid) throw new Error("Missing groupId or uid");

  try {
    await remove(ref(database, `groups/${groupId}`));
    await remove(ref(database, `users/${uid}/groups/${groupId}`));
    return true;
  } catch (err) {
    console.error("Error deleting group:", err);
    throw err;
  }
}

import { database } from "../firebase";
import { ref, remove } from "firebase/database";

export async function removeFilmFromGroup(groupId, tmdbId) {
  try {
    const filmRef = ref(database, `groups/${groupId}/films/${tmdbId}`);
    await remove(filmRef);
    return true;
  } catch (err) {
    console.log("removeFilmFromGroup failed:", err);
    return false;
  }
}

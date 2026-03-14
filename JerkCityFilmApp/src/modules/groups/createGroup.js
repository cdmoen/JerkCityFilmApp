import { database } from "../firebase";
import { ref, push, set } from "firebase/database";

export async function createGroup(uid, groupName) {
  try {
    const groupsRef = ref(database, "groups");
    const newGroupRef = push(groupsRef);
    const groupID = newGroupRef.key;

    await set(newGroupRef, {
      id: groupID,
      name: groupName,
      createdBy: uid,
      members: {
        [uid]: true,
      },
      createdAt: Date.now(),
    });

    // Add membership pointer under the user
    await set(ref(database, `users/${uid}/groups/${groupID}`), true);

    return groupID;
  } catch (err) {
    console.error("Error creating group:", err);
    throw err;
  }
}

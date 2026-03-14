import { database } from "../firebase";
import { ref, runTransaction } from "firebase/database";

export async function reserveUsername(username) {
  const usernameRef = ref(database, `usersByUsername/${username}`);

  const result = await runTransaction(usernameRef, (currentValue) => {
    if (currentValue === null) {
      return "TEMP"; // temporarily reserve
    }
    return; // abort if taken
  });

  if (!result.committed) {
    throw new Error("Username already taken");
  }
}

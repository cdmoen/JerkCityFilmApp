import { ref, onValue } from "firebase/database";
import { database } from "../modules/firebase";
import { useEffect, useState } from "react";

export function useGroupOutgoingInvites(uid, groupId) {
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    if (!uid || !groupId) return;

    const invitesRef = ref(database, `groupInvitesOutgoing/${uid}/${groupId}`);

    return onValue(invitesRef, (snap) => {
      if (!snap.exists()) {
        setInvited([]);
      } else {
        setInvited(Object.keys(snap.val())); // array of friend UIDs
      }
    });
  }, [uid, groupId]);

  return invited;
}

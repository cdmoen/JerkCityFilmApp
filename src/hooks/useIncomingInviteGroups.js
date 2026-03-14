import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../modules/firebase";

export function useIncomingInviteGroups(incomingInvites) {
  const [inviteGroups, setInviteGroups] = useState({});
  const inviteEntries = Object.entries(incomingInvites);

  useEffect(() => {
    async function load() {
      if (inviteEntries.length === 0) {
        setInviteGroups({});
        return;
      }

      const results = {};

      await Promise.all(
        inviteEntries.map(async ([inviteId, inviteData]) => {
          const groupId = inviteData.groupId;
          const snap = await get(ref(database, `groups/${groupId}`));
          if (snap.exists()) {
            results[groupId] = snap.val();
          }
        }),
      );

      setInviteGroups(results);
    }

    load();
  }, [incomingInvites]);

  return inviteGroups;
}

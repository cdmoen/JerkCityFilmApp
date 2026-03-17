import { useState } from "react";
import {
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  get,
} from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./SearchUsers.module.css";

export default function SearchUsers({
  uid,
  friends,
  incoming,
  outgoing,
  onSendRequest,
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    const value = e.target.value;
    setTerm(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const usersRef = ref(database, "usersPublic");
    const q = query(
      usersRef,
      orderByChild("username"),
      startAt(value),
      endAt(value + "\uf8ff"),
    );

    const snap = await get(q);

    if (snap.exists()) {
      const data = snap.val();
      const formatted = Object.entries(data).map(([uid, user]) => ({
        uid,
        username: user.username,
      }));

      const filtered = formatted.filter((user) => user.uid !== uid);

      setResults(filtered);
    } else {
      setResults([]);
    }
  }

  function getStatus(uid) {
    if (friends[uid]) return { label: "Friends", className: styles.friends };
    if (outgoing[uid])
      return { label: "Request sent", className: styles.outgoing };
    if (incoming[uid])
      return { label: "Requested you", className: styles.incoming };
    return { label: "Not friends", className: styles.notFriends };
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search username..."
        value={term}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      <div className={styles.results}>
        {results.map((user) => {
          const status = getStatus(user.uid);

          return (
            <div key={user.uid} className={styles.resultRow}>
              <span className={styles.username}>{user.username}</span>

              <span className={`${styles.status} ${status.className}`}>
                {status.label}
              </span>

              {status.label === "Not friends" && (
                <button
                  className={styles.addButton}
                  onClick={() => onSendRequest(user.uid)}
                >
                  Add Friend
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

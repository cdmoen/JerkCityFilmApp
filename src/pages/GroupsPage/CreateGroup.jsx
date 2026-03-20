import { useState } from "react";
import { createGroup } from "../../modules/groups/createGroup";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./CreateGroup.module.css";

export default function CreateGroup({ onCreated }) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!groupName.trim()) return;
    setError("");
    setLoading(true);

    try {
      await createGroup(user.uid, groupName.trim());
      setGroupName("");
      if (onCreated) onCreated();
    } catch {
      setError("Could not create group. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        maxLength={48}
        required
      />
      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

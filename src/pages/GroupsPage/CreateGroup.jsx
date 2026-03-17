import { useState } from "react";
import { createGroup } from "../../modules/groups/createGroup";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./CreateGroup.module.css";

export default function CreateGroup() {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createGroup(user.uid, groupName);
      setGroupName("");
    } catch {
      setError("Could not create group.");
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
        required
      />

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>

      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
}
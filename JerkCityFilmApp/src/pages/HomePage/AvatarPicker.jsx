import { ref, set } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./AvatarPicker.module.css";

const avatarList = [
  "/avatars/camcorder.png",
  "/avatars/camera.png",
  "/avatars/directorChair.png",
  "/avatars/filmRoll.png",
  "/avatars/masks.png",
  "/avatars/popcorn.png",
];

export default function AvatarPicker({ uid, onClose }) {
  function chooseAvatar(url) {
    const userRef = ref(database, `users/${uid}/avatarUrl`);
    set(userRef, url);
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.header}>Choose an Avatar</h2>

        <div className={styles.grid}>
          {avatarList.map((url) => (
            <img
              key={url}
              src={url}
              className={styles.avatar}
              onClick={() => chooseAvatar(url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import styles from "./not-found.module.scss";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.code}>
          <span>4</span>

          <span className={styles.circle}>
            <svg viewBox="0 0 200 200">
              <path
                d="M35 100a65 65 0 1 1 130 0 65 65 0 0 1 -130 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span>4</span>
        </div>

        <h2 className={styles.title}>
          There’s <span>NOTHING</span> here...
        </h2>

        <p className={styles.subtitle}>
          maybe the page you're looking for is not found or never existed.
        </p>

        <Link href="/" className={styles.button}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

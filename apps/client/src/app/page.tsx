import { AuthForm } from "@/src/features/Example/components/AuthForm";
import styles from "./page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <AuthForm />
    </div>
  );
}

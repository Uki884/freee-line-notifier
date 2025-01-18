import { ExampleList } from "@/src/features/Example/components/ExampleList";
import styles from "./page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <ExampleList />
    </div>
  );
}

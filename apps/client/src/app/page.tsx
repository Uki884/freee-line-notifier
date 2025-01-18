import { apiClient } from "../shared/lib/apiClient";
import styles from "./page.module.css";

export default async function page() {
  const response = await apiClient.api.freee.campanies.$get();

  if (!response.ok) {
    return (
      <div className={styles.page}>
        <a href="/api/freee/authorize">Freeeログイン</a>
      </div>
    );
  }

  const { result } = await response.json();

  console.log("result", result);

  return (
    <div className={styles.page}>
      <a href="/api/freee/authorize">Freeeログイン</a>
      <div>
        <h1>会社一覧</h1>
        <ul>
          {result.companies.map((company) => (
            <li key={company.id}>{company.display_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

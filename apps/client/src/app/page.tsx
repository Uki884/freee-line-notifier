import { apiClient } from "../shared/lib/apiClient";
import styles from "./page.module.css";

export default async function page() {
  const result = await apiClient.api.freee.campanies
    .$get()
    .then(async (res) => await res.json());
  console.log("companyRoutes", result);

  if (!result) {
    return (
      <div className={styles.page}>
        <h1>エラーが発生しました</h1>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <a href="/api/freee/authorize">Freeeログイン</a>
      <div>
        <h1>会社一覧</h1>
        <ul>
          {result.companyList.map((company) => (
            <li key={company.id}>{company.display_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

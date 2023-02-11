import { useState } from "react";
import styles from "../styles/news.module.scss";
import { fetchForumPosts } from "../api/fetching";
import ErrorBox from "./common/ErrorBox";
import PostPreview from "./forum/PostPreview";
const resource = fetchForumPosts({ tags: ["News"] });

function News(props) {
  //const [articles, setArticles] = useState([])
  /**
     * <div suppressHydrationWarning className={styles["article-container"]}>
                    <div className={styles["article-header"]}>
                        <span className={styles["article-date"]}>{article.date}</span>
                        <span className={styles["article-title"]}>{article.title}</span>
                    </div>
                    <p className={styles["article-summary"]}>{article.summary}</p>
                </div>
     */
  let articles = [];
  try {
    const data = resource.read();
    articles = data.posts;
  } catch (err) {
    return;
  }

  if (articles.length == 0) {
    return (
      <div suppressHydrationWarning className="news-container">
        <h3>News</h3>
        <ErrorBox message={"There is no news"} />
      </div>
    );
  }

  return (
    <div className="news-container">
      <h3>News</h3>
      {articles.map((article) => {
        return (
          <PostPreview
            title={article.title}
            content={article.content}
            date={article.date}
            tags={article.tags}
            replyCount={article.replyCount}
          />
        );
      })}
    </div>
  );
}

export function Skeleton() {
  const defaultData = [
    { author: "", date: "", title: "", summary: "" },
    { author: "", date: "", title: "", summary: "" },
  ];
  return (
    <div style={{ gridArea: "news" }}>
      <News articles={defaultData} />
    </div>
  );
}

export default News;

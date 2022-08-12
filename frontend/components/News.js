import { useState } from "react";
import styles from "../styles/news.module.scss";

function News(props) {
    const [articles, setArticles] = useState(props.articles);

    return (
        <section className="news-container">
            <h3>News</h3>
            {articles.map(article => {
                return (<section className={styles["article-container"]}>
                    <div className={styles["article-header"]}>
                        <span className={styles["article-date"]}>{article.date}</span>
                        <span className={styles["article-title"]}>{article.title}</span>
                    </div>
                    <p className={styles["article-summary"]}>{article.summary}</p>
                </section>)
            })}
            <div className={styles["read-more-container"]}>
                <span className={styles["read-more-text"]}>Read more...</span>
            </div>
        </section>
    )
}

export function Skeleton() {
    const defaultData = [
        {author: "", date: "", title: "", summary: ""},
        {author: "", date: "", title: "", summary: ""},
    ]
    return (
        <div style={{gridArea: "news"}}>
        <News articles={defaultData} />
        </div>
    )
}

export default News;
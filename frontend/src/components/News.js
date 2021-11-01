import "../styles/news.scss"

function News(props) {
    return (
        <section className="news-container">
            {props.articles.map(article => {
                return (<section className="article-container">
                    <header>
                        <span className="article-author">{article.author}</span>
                        <span className="article-date">{article.date}</span>
                    </header>
                    
                    <span className="article-title">{article.title}</span>
                </section>)
            })}
        </section>
    )
}

export default News
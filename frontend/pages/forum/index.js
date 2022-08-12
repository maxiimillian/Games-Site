import styles from "../../styles/forum.module.scss";
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const testResponse = [
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is This is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titlea title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontent would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
    {title: "This is a title", date: "Posted 6 hours ago", author: "John Doe", content: "This is what the content would look like if there was actually any content", replyCount: "145 replies"},
]

const tags = ["Sudoku", "Poker", "Crossword", "Tic-Tac-Toe", "Suggestions", "Bugs", "Other"]

function ForumPage(props) {
    return (
        <div className={styles["forum"]}>
            <div className={styles["tags-container"]}>
                {tags.map(tag => {
                    return <button className={styles["tag-button"]}>{tag}</button>
                })}
            </div>
            <div className={styles["search-bar"]}>
                <FontAwesomeIcon className="arrow" icon={faSearch} size="lg" />
                <input placeholder="Search by title, content, or tags"></input>
            </div>
            <div className={styles["posts-container"]}>
                {testResponse.map(post => {

                })}
            </div>
            <h1>Forum</h1>
        </div>
    )
}

export default ForumPage;
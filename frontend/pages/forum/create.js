import styles from "../../styles/forum.module.scss";
import { useState } from "react";
import Tag from "../../components/forum/Tag";

function ForumCreate(props) {
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const tagOptions = ["Sudoku", "Poker", "Crossword", "Tic-Tac-Toe", "Suggestions", "Bugs", "Other"]

    function addTag(tag) {
        if (tags.includes(tag)) {
            setTags(tags.filter((tagToCompare) => {
                return tagToCompare !== tag;
            }));
        } else {
            setTags([...tags, tag]);
        }
    }

    async function submitForm(e) {
        e.preventDefault();
        const payload = {
            tags: tags,
            title: title,
            content: content,
            token: localStorage.getItem("token"),
        }
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta/forum/create`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
    }

    //the current form creation styling doesnt really match the rest of the site. 
    //the rest uses mostly solid colours with box shadows rather than the neon outline thing for this
    //should probably make the tags a solid $green-box and the input fields the green or grey that the logins used
    return (
        
        <form className={styles["forum-create"]} onSubmit={(e) => submitForm(e)}>
            <h1>Create your post</h1>
            <input className={styles["create-input"]} name="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required></input>
            <textarea 
                rows={5} cols={10} className={styles["create-input"]} name="content" 
                placeholder="Type your post here..." value={content} onChange={(e) => setContent(e.target.value)}>
            </textarea>
            <div className={styles["create-tag-container"]}>
                {tagOptions.map(tag => {
                    return <Tag name={tag} handleClick={addTag}></Tag>
                })}
            </div>

            <button className={`submit ${styles["create-submit"]}`} type="submit">Create Post</button>
        </form>
    )
}

export default ForumCreate;
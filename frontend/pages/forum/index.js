import styles from "../../styles/forum.module.scss";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Tag from "../../components/forum/Tag";
import PostPreview from "../../components/forum/PostPreview";
import Link from "next/link";

export async function getServerSideProps(context) {
  return {
    props: {
    },
  };
}

const testResponse = [
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title:
      "This is This is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titleThis is a titlea title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontent would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
  {
    title: "This is a title",
    date: "Posted 6 hours ago",
    author: "John Doe",
    content:
      "This is what the content would look like if there was actually any content",
    replyCount: "145 replies",
  },
];

const VALID_TAGS = [
  "Sudoku",
  "Poker",
  "Crossword",
  "Tic-Tac-Toe",
  "Suggestions",
  "Bugs",
  "Other",
];

function ForumPage(props) {
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [direction, setDirection] = useState("Asc");

  function addTag(tag) {
    if (tags.includes(tag)) {
      setTags(
        tags.filter((tagToCompare) => {
          return tagToCompare !== tag;
        })
      );
    } else {
      setTags([...tags, tag]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    getPosts();
  }

  useEffect(() => {
    getPosts();
  }, [tags, sortBy, direction]);

  async function getPosts() {
    await fetch(
      `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/meta/forum/posts?` +
        new URLSearchParams({
          tags: tags,
          sortBy: sortBy,
          query: query,
          direction: direction,
        }),
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
        }
      });
  }

  return (
    <div className={styles["forum"]}>
      <div className={styles["tags-container"]}>
        {VALID_TAGS.map((tag) => {
          return <Tag name={tag} handleClick={addTag}></Tag>;
        })}
      </div>
      <div className={styles["forum-header-container"]}>
        <form className={styles["search-bar"]} onSubmit={handleSubmit}>
          <button type="submit">
            <FontAwesomeIcon className="arrow" icon={faSearch} size="lg" />
          </button>
          <input
            placeholder="Search by title, content, or tags"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
        </form>
        <Link href="/forum/create">
          <FontAwesomeIcon
            className={styles["create"]}
            icon={faPlus}
            size="lg"
          />
        </Link>
      </div>
      <select
        className={styles["filters"]}
        name="sortBy"
        id="sortBy"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="Date">Date</option>
        <option value="Votes">Votes</option>
      </select>
      <select
        className={styles["filters"]}
        name="direction"
        id="direction"
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
      >
        <option value="Asc">Asc</option>
        <option value="Desc">Desc</option>
      </select>
      <div className={styles["posts-container"]}>
        {posts.map((post) => {
          return (
            <PostPreview
              title={post.title}
              content={post.content}
              date={post.date}
              replyCount={post.comment_count}
              votes={post.votes}
              tags={post.tags}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ForumPage;

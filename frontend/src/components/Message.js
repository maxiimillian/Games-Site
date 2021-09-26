function Message(props) {
    return (
        <div>
            <span class="chat-user">{props.user}</span>
            <span class="message">{props.content}</span>
        </div>
    )
}

export default Message;
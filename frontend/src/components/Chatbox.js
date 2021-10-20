import Message from "./Message";

function Chatbox({ messages }) {

    let numbers = 0;

    return (
        <div class="chat-messages">
            <ul class="messages-container">
                {messages.slice(0).reverse().map(message => {
                    console.log(messages, message);
                    numbers = numbers + 1;
                    return <li class="message-item"><Message key={numbers} user={message.user} content={message.content} author={message.author}/></li>
                })}
            </ul>
        </div>
    )
}

export default Chatbox;
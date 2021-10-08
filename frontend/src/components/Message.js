import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function Message(props) {
    return (
        <div>
            {props.author ? <FontAwesomeIcon fixedWidth style={{padding: "0px 5px", color: "#A8BD92"}} icon={faArrowRight} /> : null}
            <span class="chat-user">{props.user}</span>
            <span class="message">{props.content}</span>
        </div>
    )
}

export default Message;
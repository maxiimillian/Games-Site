import Chatbox from './common/Chatbox';

const Table = lazy(() => import("./poker/Table"));

function Poker() {
    return (
        <div>
            <div className="center-container">
                <Table />
            </div>
            <div className="right-container">
                <Chatbox />
            </div>
        </div>
    )
}

export default Poker;
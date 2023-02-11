function Loading() {
  return (
    <div className="top-container">
      <div className="page-container">
        <div className="left-container"></div>
        <div className="center-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{ marginTop: "8em" }}
              className="options-sidebar-container"
            >
              <div className="options-container">
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
                <section
                  style={{ padding: "7em" }}
                  className="game-option"
                ></section>
              </div>
              <div className="sidebar-container">
                <button
                  style={{ padding: "30px", background: "#212121" }}
                  className="settings-button"
                ></button>
                <button
                  style={{ padding: "30px", background: "#212121" }}
                  className="settings-button"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div className="right-container"></div>
      </div>
    </div>
  );
}

export default Loading;

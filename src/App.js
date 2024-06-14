import React, { useState } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./";
function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (newState) => {
    setEditorState(newState);
  };

  return (
    <div className="App">
      <div className="d-flex">
        <h1>Demo Editor by Bhumik</h1>
      </div>
      <div
        style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
        onClick={() => this.editor.focus()}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          ref={(element) => {
            this.editor = element;
          }}
        />
      </div>
    </div>
  );
}

export default App;

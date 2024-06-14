import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  CompositeDecorator,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Draft from "./components/DraftDemo";

// Decorator for red text
const redSpan = (props) => {
  return <span style={{ color: "red" }}>{props.children}</span>;
};

const findRedText = (contentBlock, callback) => {
  contentBlock.findStyleRanges(
    (character) => character.hasStyle("RED"),
    callback,
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findRedText,
    component: redSpan,
  },
]);

function App() {
  return (
    <div className="App">
      <Draft />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { decorator } from "../helper/draftHelper";

function Draft() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator),
  );

  const handleEditorChange = (newState) => {
    setEditorState(newState);
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (e) => {
    if (e.key === " ") {
      const selection = editorState.getSelection();
      const startKey = selection.getStartKey();
      const currentContent = editorState.getCurrentContent();
      const block = currentContent.getBlockForKey(startKey);
      const blockText = block.getText();

      if (blockText === "#") {
        return "convert-to-header-one";
      } else if (blockText === "*") {
        return "apply-bold";
      } else if (blockText === "**") {
        return "apply-red";
      } else if (blockText === "***") {
        return "apply-underline";
      }
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommandWithHash = (command, editorState) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(startKey);
    const blockText = block.getText();

    let newContentState = currentContent;
    let newEditorState = editorState;

    if (command === "convert-to-header-one" && blockText === "#") {
      // Create a new block with the header-one type and remove the '#'
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "backward",
      );
      newContentState = Modifier.setBlockType(
        newContentState,
        newContentState.getSelectionAfter(),
        "header-one",
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-type",
      );
    } else if (command === "apply-bold" && blockText === "*") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "backward",
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style",
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
    } else if (command === "apply-red" && blockText === "**") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "backward",
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style",
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "RED");
    } else if (command === "apply-underline" && blockText === "***") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "backward",
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style",
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE");
    }

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return "handled";
    }

    return handleKeyCommand(command, editorState);
  };

  return (
    <>
      <h1>Draft.js Rich Text Editor</h1>
      <div
        style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
        // onClick={() => this.editor.focus()}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommandWithHash}
          keyBindingFn={keyBindingFn}
          // ref={(element) => {
          //   this.editor = element;
          // }}
        />
      </div>
    </>
  );
}

export default Draft;

import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { convertToRaw } from "draft-js";
import { convertFromRaw } from "draft-js";

function Draft() {
  const draftContent = localStorage.getItem("draftRaw");

  const [editorState, setEditorState] = useState(() => {
    if (draftContent) {
      return EditorState.createWithContent(
        convertFromRaw(JSON.parse(draftContent))
      );
    }
    return EditorState.createEmpty();
  });

  const draftRef = useRef(null);

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
        "backward"
      );
      newContentState = Modifier.setBlockType(
        newContentState,
        newContentState.getSelectionAfter(),
        "header-one"
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-type"
      );
    } else if (command === "apply-bold" && blockText === "*") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "backward"
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
    } else if (command === "apply-red" && blockText === "**") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "backward"
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "RED");
    } else if (command === "apply-underline" && blockText === "***") {
      newContentState = Modifier.removeRange(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "backward"
      );
      newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE");
    }

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return "handled";
    }

    return handleKeyCommand(command, editorState);
  };

  const handleSave = () => {
    let contentRaw = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem("draftRaw", JSON.stringify(contentRaw));
  };

  return (
    <div className="m-3">
      <div className="flex justify-between items-center mb-2">
        <div></div>
        <h1>Draft.js Rich Text Editor</h1>
        <button className="button" onClick={handleSave}>
          Save
        </button>
      </div>
      <div
        style={{ border: "2px solid blue", minHeight: "6em", cursor: "text" }}
        onClick={() => draftRef.current.focus()}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommandWithHash}
          keyBindingFn={keyBindingFn}
          ref={draftRef}
        />
      </div>
    </div>
  );
}

export default Draft;

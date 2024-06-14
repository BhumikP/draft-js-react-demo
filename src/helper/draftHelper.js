import { CompositeDecorator } from "draft-js";
const redSpan = (props) => {
  return <span style={{ color: "red" }}>{props.children}</span>;
};

const findRedText = (contentBlock, callback) => {
  contentBlock.findStyleRanges(
    (character) => character.hasStyle("RED"),
    callback,
  );
};

export const decorator = new CompositeDecorator([
  {
    strategy: findRedText,
    component: redSpan,
  },
]);

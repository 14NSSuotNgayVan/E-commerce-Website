import React, { FC } from "react";

interface CustomComponentProps {
  tagName: keyof JSX.IntrinsicElements;
  content: string | undefined;
  className?: string;
}

export const CustomElementbyTagName: FC<CustomComponentProps> = (props) => {
  const { tagName, content, ...rest } = props;
  return React.createElement(
    tagName,
    rest,
    content ? content : ""
  );
};
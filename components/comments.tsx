import { use } from "react";

export default function Comments() {
  const getComments = (): Promise<string[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(["Hello,", "This", "is", "a", "Comment"]), 5000)
    );
  };
  const comments = use(getComments()) as string[];

  return comments.map((comment, index) => <p key={index}>{comment}</p>);
}

const a = 10
"use client";
import "./index.css";

import Comments from "@/components/comments";
import { KeyboardEvent, useState } from "react";
import CustomButton from "@/components/custon-button";
import { DialogDemo } from "@/components/dialog-demo";
import SonnerDemo from "@/components/sonner-demo";
import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";

import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
hljs.registerLanguage("javascript", js);
hljs.registerLanguage("typescript", ts);
hljs.registerLanguage("css", css);

export default function Home() {
  // console.log(buttonVariants({ variant: "destructive" }));
  const [code, setCode] = useState(
    `
export default function Comments() {
  const getComments = (): Promise<string[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(["Hello,", "This", "is", "a", "Comment"]), 5000)
    );
  };
  const comments = use(getComments()) as string[];

  return comments.map((comment, index) => <p key={index}>{comment}</p>);
}

const a = 10;
    `
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <Button asChild>
          <Link href="/">Link</Link>
        </Button>
        <Link href="#" className={buttonVariants()}>
          Click here
        </Link> */}
        {/* <SonnerDemo /> */}
        {/* <Toaster /> */}
        {/* <DialogDemo /> */}

        <article className="prose">
          <h1>Garlic bread with cheese: What the science tells us</h1>
          <p>
            For years parents have espoused the health benefits of eating garlic
            bread with cheese to their children, with the food earning such an
            iconic status in our culture that kids will often dress up as warm,
            cheesy loaf for Halloween.
          </p>
          <p>
            But a recent study shows that the celebrated appetizer may be linked
            to a series of rabies cases springing up around the country.
          </p>
        </article>

        <Suspense fallback={<div>Loading...</div>}>
          <Comments />
        </Suspense>

        <HighlightedCode language="javascript">const a = 10</HighlightedCode>

        <CodeEditor
          code={code}
          setCode={setCode}
          language={"javascript"}
          noneditable={false}
        />
      </main>
    </div>
  );
}

type Props = {
  overlay?: ReactNode;
  language?: string;
  children: string;
};

function HighlightedCode({ overlay, language, children }: Props) {
  const __html = language ? highlightCode(children, language) : children;

  return (
    <div
      className={`not-prose relative w-full overflow-x-scroll rounded bg-slate-50 dark:bg-stone-800`}
    >
      <div className="relative h-fit min-h-full w-fit min-w-full p-4 text-sm leading-[1.4rem]">
        <div
          dangerouslySetInnerHTML={{ __html }}
          className="h-full w-full whitespace-pre text-nowrap font-firacode not-italic"
        />
        {overlay}
      </div>
    </div>
  );
}

// TODO: newline 처리 더 깔끔하게
const highlightCode = (code: string, language: string) => {
  let highlightedCode = hljs.highlight(code, { language }).value;

  if (highlightedCode === "") highlightedCode = " ";
  if (highlightedCode[highlightedCode.length - 1] === "\n")
    highlightedCode += " ";

  return highlightedCode;
};

function CodeEditor({
  language,
  code,
  setCode,
  noneditable = false,
}: {
  language: string;
  code: string;
  setCode?: (code: string) => void;
  noneditable?: boolean;
}) {
  return (
    <HighlightedCode
      overlay={
        <CodeTextArea code={code} setCode={setCode} disabled={noneditable} />
      }
      language={language}
    >
      {code}
    </HighlightedCode>
  );
}

function CodeTextArea({
  code,
  disabled,
  setCode,
}: {
  code: string;
  disabled: boolean;
  setCode?: (code: string) => void;
}) {
  return (
    <textarea
      name="code"
      aria-label="editor"
      autoCapitalize="off"
      autoComplete="off"
      spellCheck="false"
      className="absolute bottom-4 left-4 right-4 top-4 resize-none whitespace-pre bg-transparent font-firacode text-transparent caret-sky-500 outline-none"
      value={code}
      disabled={disabled}
      onChange={(e) => setCode?.(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e)}
    />
  );
}

const getLineIndices = (str: string, idx: number) => {
  let lineStart = idx;
  while (lineStart > 0 && str[lineStart - 1] !== "\n") lineStart--;

  let wordStart = lineStart;
  while (str[wordStart] === " " || str[wordStart] === "\t") wordStart++;

  return { wordStart, lineStart };
};

const handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  const target = e.target as HTMLTextAreaElement;
  if (target.selectionStart !== target.selectionEnd) return;

  const selection = target.selectionStart;
  const lastLetter = target.value[selection - 1];

  const { wordStart, lineStart } = getLineIndices(target.value, selection);
  const blank = wordStart - lineStart + (lastLetter === "{" ? TAB.length : 0);
  if (blank === 0) return;

  // Insert carriage return and indented text
  // https://stackoverflow.com/questions/60581285/
  document.execCommand("insertText", false, `\n${" ".repeat(blank)}`);
  e.preventDefault();
};

const TAB = "  ";

const handleTabKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  const target = e.target as HTMLTextAreaElement;

  if (target.selectionStart === target.selectionEnd) {
    // undoable
    if (!e.shiftKey) {
      document.execCommand("insertText", false, TAB);
    } else {
      const { wordStart, lineStart } = getLineIndices(
        target.value,
        target.selectionStart
      );

      const blank = wordStart - lineStart;
      if (blank < TAB.length) return;

      // TODO: undo 이후 selection 남는거 없애기
      const tmp = target.selectionStart;
      target.selectionStart = wordStart - TAB.length;
      target.selectionEnd = wordStart;
      document.execCommand("delete");
      target.selectionStart = target.selectionEnd = Math.max(0, tmp - 2);
    }
  } else {
    //
  }
};

// https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
  switch (e.key) {
    case "Enter":
      handleEnterKeyDown(e);
      break;
    case "Tab":
      e.preventDefault();
      handleTabKeyDown(e);
      break;
  }
}

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImperativeHandle, type Ref } from "react";
import CharacterCounter from "./components/character-counter";
import MenuBar from "./components/menu-bar";

interface EditorProps {
  ref?: Ref<Partial<HTMLInputElement>>;
  content?: string;
  placeholder?: string;
  maxLength?: number;
  error?: boolean;
  onChange?: (content: string) => void;
  onBlur?: () => void;
}

const Editor = ({
  ref,
  content,
  placeholder,
  maxLength,
  error,
  onChange,
  onBlur,
}: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {},
        orderedList: {},
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-[#adb5bd] before:h-0 before:pointer-events-none",
      }),
      CharacterCount.configure({ limit: maxLength }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-purple underline cursor-pointer",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm break-all px-2 text-sm prose-li:pl-0 prose-em:italic h-full pb-4 pt-2 max-w-full text-default prose-stone prose-p:m-0 focus-visible:outline-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4",
      },
    },
  });

  useImperativeHandle(ref, () => {
    return {
      focus: () => {
        editor?.commands.focus();
      },
      blur: () => {
        editor?.commands.blur();
      },
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      aria-invalid={error}
      className="border-input placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative flex min-h-52 w-full flex-col rounded-lg border bg-transparent text-base transition-[color,box-shadow] outline-none focus-within:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    >
      <MenuBar editor={editor} />
      <div className="flex flex-1 flex-col">
        <EditorContent editor={editor} className="flex-1" />
        {maxLength && (
          <CharacterCounter editor={editor} maxLength={maxLength} />
        )}
      </div>
    </div>
  );
};

export default Editor;

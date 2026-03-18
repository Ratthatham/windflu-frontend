import { cn } from '@/lib/utils'
import { Editor, useEditorState } from '@tiptap/react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  LinkIcon,
  UnlinkIcon,
} from 'lucide-react'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBoldActive: editor?.isActive('bold') || false,
      isItalicActive: editor?.isActive('italic') || false,
      isUnderlineActive: editor?.isActive('underline') || false,
      isStrikeActive: editor?.isActive('strike') || false,
      isBulletListActive: editor?.isActive('bulletList') || false,
      isOrderedListActive: editor?.isActive('orderedList') || false,
      isBlockquoteActive: editor?.isActive('blockquote') || false,
      isHeading1Active: editor?.isActive('heading', { level: 1 }) || false,
      isHeading2Active: editor?.isActive('heading', { level: 2 }) || false,
      isHeading3Active: editor?.isActive('heading', { level: 3 }) || false,
      isLinkActive: editor?.isActive('link') || false,
      textAlign: editor?.getAttributes('textAlign') || 'left',
    }),
  })

  if (!editor || !state) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border-border bg-muted/30 rounded-t-lg border-b px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isBoldActive && 'bg-accent text-accent-foreground'
          )}
        >
          <BoldIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isItalicActive && 'bg-accent text-accent-foreground'
          )}
        >
          <ItalicIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isUnderlineActive && 'bg-accent text-accent-foreground'
          )}
        >
          <UnderlineIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isStrikeActive && 'bg-accent text-accent-foreground'
          )}
        >
          <StrikethroughIcon className="size-4" />
        </button>

        <div className="bg-border mx-1 h-4 w-px" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isHeading1Active && 'bg-accent text-accent-foreground'
          )}
        >
          <Heading1Icon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isHeading2Active && 'bg-accent text-accent-foreground'
          )}
        >
          <Heading2Icon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isHeading3Active && 'bg-accent text-accent-foreground'
          )}
        >
          <Heading3Icon className="size-4" />
        </button>

        <div className="bg-border mx-1 h-4 w-px" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isBulletListActive && 'bg-accent text-accent-foreground'
          )}
        >
          <ListIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isOrderedListActive && 'bg-accent text-accent-foreground'
          )}
        >
          <ListOrderedIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isBlockquoteActive && 'bg-accent text-accent-foreground'
          )}
        >
          <QuoteIcon className="size-4" />
        </button>

        <div className="bg-border mx-1 h-4 w-px" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.textAlign === 'left' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.textAlign === 'center' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignCenterIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.textAlign === 'right' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignRightIcon className="size-4" />
        </button>

        <div className="bg-border mx-1 h-4 w-px" />

        <button
          type="button"
          onClick={setLink}
          className={cn(
            'hover:bg-muted rounded p-2 transition-colors',
            state.isLinkActive && 'bg-accent text-accent-foreground'
          )}
        >
          <LinkIcon className="size-4" />
        </button>
        {state.isLinkActive && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="hover:bg-muted rounded p-2 transition-colors"
          >
            <UnlinkIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default MenuBar

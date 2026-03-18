import { useEditorState, type Editor } from '@tiptap/react'

interface CharacterCounterProps {
  editor: Editor | null
  maxLength: number
}

const CharacterCounter = ({ editor, maxLength }: CharacterCounterProps) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        characterCount: ctx?.editor?.getText().replace(/\n/gm, '').length || 0,
      }
    },
  })

  return (
    <div className="text-muted-foreground pr-2 pb-1 text-right text-xs">
      {editorState?.characterCount} / {maxLength}
    </div>
  )
}

export default CharacterCounter

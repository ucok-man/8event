'use client';

import { Editor, EditorContent } from '@tiptap/react';

type Props = {
  editor: Editor | null;
};

export default function EditorSpace({ editor }: Props) {
  if (!editor) return null;
  return (
    <div className="">
      <EditorContent editor={editor} className="" />
    </div>
  );
}

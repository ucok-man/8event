'use client';

import Link from '@tiptap/extension-link';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Editor from './editor-space';
import Toolbar from './toolbar';

type Props = {
  description: string;
  onChange: (richtext: string) => void;
};

export default function RichTextEditor({ description, onChange }: Props) {
  const typographyStyle = `
  prose prose-sm 
  prose-headings:font-semibold prose-headings:text-gray-800 prose-headings:m-0 prose-headings:mb-2
  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
  prose-p:text-gray-800 prose-p:leading-relaxed prose-p:m-0 prose-p:mb-1 prose-p:-space-y-0
  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:cursor-pointer
  prose-strong:text-gray-800 prose-strong:font-bold
  prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-800 prose-li:m-0
  prose-img:rounded-md prose-img:shadow-md
  mx-auto max-w-none p-6 px-3 pt-3 min-h-[360px]
  transition-all duration-200 ease-in-out
  border border-gray-200 rounded-md focus-visible:outline-none focus-visible:outline-0
  `;

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: typographyStyle.trim().replaceAll('\n', ' '),
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ImageResize,
      TextStyle,
      Link.configure({
        openOnClick: true,
        autolink: true,
        shouldAutoLink: (url) => url.startsWith('https://'),
        defaultProtocol: 'https',
      }),
    ],
    content: description,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm focus:ring-2 focus-within:border-brand-rose-500 focus-within:ring-brand-rose-500 focus-within:ring-1 focus-within:ring-ring">
      <Toolbar editor={editor} />
      <Editor editor={editor} />
    </div>
  );
}

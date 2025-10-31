'use client';

import { useAuthContext } from '@/context/auth-provider';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
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

  const { apiclient } = useAuthContext();

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: typographyStyle.trim().replaceAll('\n', ' '),
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          const { state, dispatch } = view;
          const { selection } = state;
          const { $from } = selection;

          // Check if selection is on an image node
          const node = $from.nodeAfter;
          if (
            node?.type.name === 'image' &&
            (event.key === 'Backspace' || event.key === 'Delete')
          ) {
            event.preventDefault(); // Prevent default delete behavior

            if (
              node.attrs['src'].startsWith(
                'https://res.cloudinary.com/dx6hmxiv3/image/upload/',
              )
            ) {
              apiclient.delete('/media', {
                data: {
                  mediaUrl: node.attrs['src'],
                },
              });
            }

            // Dispatch a transaction to remove the image node
            dispatch(state.tr.delete($from.pos, $from.pos + node.nodeSize));
            return true; // Return true to indicate the event was handled
          }

          return false;
        },
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
      TextStyleKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        shouldAutoLink: (url) => url.startsWith('https://'),
        defaultProtocol: 'https',
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
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

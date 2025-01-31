'use client';

import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import {
  AlignButton,
  CommonButton,
  HeadingLevelButton,
  ImageButton,
  LinkButton,
  ListButton,
} from './toolbar-buttons';

type Props = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const TOOLBAR_COMMON = [
    {
      label: 'Bold',
      icon: BoldIcon,
      isActive: editor?.isActive('bold'),
      onClick: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: ItalicIcon,
      isActive: editor?.isActive('italic'),
      onClick: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Underline',
      icon: UnderlineIcon,
      isActive: editor?.isActive('underline'),
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: 'Strike Through',
      icon: StrikethroughIcon,
      isActive: editor?.isActive('strike'),
      onClick: () => editor?.chain().focus().toggleStrike().run(),
    },
  ];

  return (
    <div className="mb-1 flex w-full flex-wrap gap-1 rounded-sm border">
      <HeadingLevelButton editor={editor} />
      <AlignButton editor={editor} />
      <ListButton editor={editor} />
      {TOOLBAR_COMMON.map((item, idx) => (
        <CommonButton key={idx} {...item} />
      ))}
      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
    </div>
  );
}

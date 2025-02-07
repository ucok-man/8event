'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { apiclient } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
// import { useEditorStore } from '@/store/use-editor-store';
import { Level } from '@tiptap/extension-heading';
import { Editor } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
  ImageIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  LucideIcon,
  SearchIcon,
  UploadIcon,
} from 'lucide-react';
import { useState } from 'react';

type CommonButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
};

export function CommonButton({
  onClick,
  isActive,
  icon: Icon,
}: CommonButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
        isActive && 'bg-neutral-200/80',
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

export function HeadingLevelButton({ editor }: { editor: Editor }) {
  const headings = [
    { label: 'Normal Text', value: 0 },
    { label: 'Heading 1', value: 1 },
    { label: 'Heading 2', value: 2 },
    { label: 'Heading 3', value: 3 },
    { label: 'Heading 4', value: 4 },
    { label: 'Heading 5', value: 5 },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= headings.length; level++) {
      if (editor?.isActive('heading', { level })) {
        return `Heading ${level}`;
      }
    }
    return 'Normal Text';
  };

  const isActive = (value: number) =>
    (value === 0 && !editor?.isActive('heading')) ||
    editor?.isActive('heading', { level: value });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            'flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200/80'
          }
        >
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {headings.map(({ label, value }) => (
          <button
            type="button"
            key={value}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .setHeading({ level: value as Level })
                  .run();
              }
            }}
            className={cn(
              'flex items-center gap-x-2 px-2 rounded-sm hover:bg-neutral-200/80',
              isActive(value) && 'bg-neutral-200/80',
            )}
          >
            <span>{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LinkButton({ editor }: { editor: Editor }) {
  const [value, setValue] = useState('');

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setValue('');
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) setValue(editor?.getAttributes('link').href || '');
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            'flex h-7 min-w-7 shrink-0 flex-col items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200/80'
          }
        >
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex items-center gap-x-2 p-2.5">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ImageButton({ editor }: { editor: Editor }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { isPending, mutate: upload } = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file-upload', file);
      const response = await apiclient.post('/media/upload-assets', form);
      return response.data;
    },
    onSuccess: (data) => {
      setImageUrl('');
      insertImage(data.imageUrl);
    },
    onError: () => {
      toast({
        title: 'Upload Failed',
        description:
          'There was an error uploading your image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const insertImage = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) upload(file);
    };
    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      insertImage(imageUrl);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      {isPending ? (
        <div className="flex h-full items-center justify-center relative top-[7px]">
          <div
            className="inline-block h-3 w-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface dark:text-white"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-7 min-w-7 items-center justify-center rounded-sm px-1.5 text-sm hover:bg-neutral-200/80"
              >
                <ImageIcon className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleUpload}>
                <UploadIcon className="mr-2 size-2" />
                Upload
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <SearchIcon className="mr-2 size-2" />
                Paste URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image URL</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="https://example.com"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
              />
              <DialogFooter>
                <Button onClick={handleImageUrlSubmit}>Insert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

export function AlignButton({ editor }: { editor: Editor }) {
  const alignments = [
    { label: 'Align Left', value: 'left', icon: AlignLeftIcon },
    { label: 'Align Center', value: 'center', icon: AlignCenterIcon },
    { label: 'Align Right', value: 'right', icon: AlignRightIcon },
    { label: 'Align Justify', value: 'justify', icon: AlignJustifyIcon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            'flex h-7 min-w-7 shrink-0 flex-col items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200/80'
          }
        >
          <AlignLeftIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            type="button"
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
              editor?.isActive({ textAlign: value }) && 'bg-neutral-200/80',
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ListButton({ editor }: { editor: Editor }) {
  const lists = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      isActive: () => editor?.isActive('bulletList'),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Ordered List',
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive('orderedList'),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            'flex h-7 min-w-7 shrink-0 flex-col items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200/80'
          }
        >
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            type="button"
            key={label}
            onClick={onClick}
            className={cn(
              'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
              isActive() && 'bg-neutral-200/80',
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

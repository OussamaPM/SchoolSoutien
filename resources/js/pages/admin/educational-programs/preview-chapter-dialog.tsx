import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { render } from '@maily-to/render';
import type { Editor } from '@tiptap/core';
import { EyeIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChapterPreviewIFrame } from './chapter-preview-iframe';

type PreviewChapterDialogProps = {
    title?: string;
    previewText?: string;
    editor: Editor | null;
};

export function PreviewChapterDialog(props: PreviewChapterDialogProps) {
    const { title = '', previewText = '', editor } = props;

    const [open, setOpen] = useState(false);
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                className="flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-lg:w-7"
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsLoading(true);

                    if (!editor) {
                        toast.error('Pas de contenu à prévisualiser');
                        return;
                    }

                    setHtml('');
                    const json = editor.getJSON();
                    if (!json) {
                        toast.error('Pas de contenu à prévisualiser');
                        return;
                    }
                    setHtml(await render(json));
                    setOpen(true);
                    setIsLoading(false);
                }}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
                ) : (
                    <EyeIcon className="inline-block size-4 shrink-0 lg:mr-1" />
                )}
                <span className="hidden lg:inline-block">
                    Prévisualisation chapitre
                </span>
            </DialogTrigger>

            {open && (
                <DialogContent className="z-[99999] flex max-w-[620px] flex-col border-none bg-transparent p-0 shadow-none max-[680px]:h-full max-[680px]:border-0 max-[680px]:p-2">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Prévisualisation chapitre</DialogTitle>
                        <DialogDescription>
                            Prévisualisation du chapitre que les utilisateurs
                            finaux verrons.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
                        <h3 className="font-medium">
                            {title || 'Titre du chapitre'}
                        </h3>
                    </div>

                    <div className="flex min-h-[75vh] w-full grow overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                        <ChapterPreviewIFrame
                            wrapperClassName="w-full"
                            className="h-full w-full grow"
                            innerHTML={html}
                        />
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}

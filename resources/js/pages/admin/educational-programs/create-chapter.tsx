import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import defaultEmailJSON from '@/lib/default-editor-json.json';
import { cn } from '@/lib/utils';
import programs from '@/routes/admin/educational-programs';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import '@maily-to/core/style.css';
import { Editor, FocusPosition } from '@tiptap/core';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { ChapterEditor } from './chapter-editor';
import { EducationLevel } from './levels';
import { PreviewChapterDialog } from './preview-chapter-dialog';
import { Subject } from './subjects';

export interface Chapter {
    id: number;
    title: string;
    content: string;
    creator: User | null;
    created_at: string;
    updated_at: string;
}

const breadcrumbs = (
    levelId?: number,
    levelName?: string,
    categoryId?: number,
    categoryName?: string,
    subjectId?: number,
    subjectName?: string,
): BreadcrumbItem[] => [
    { title: 'Programmes', href: programs.levelCategories.url() },
    {
        title: categoryName || 'Niveaux',
        href: programs.levels.url(categoryId!),
    },
    {
        title: levelName || 'Matières',
        href: programs.subjects.url([categoryId!, levelId!]),
    },
    {
        title: subjectName || 'Chapitres',
        href: programs.chapters.url([categoryId!, levelId!, subjectId!]),
    },
    {
        title: 'Créer',
        href: '#',
    },
];

type UpdateTemplateData = {
    title: string;
    previewText: string;
    content: string;
};

type SaveTemplateResponse = {
    template: any;
};

interface Props {
    chapters: Chapter[];
    subject: Subject;
    level: EducationLevel;
    category: Category;
    template?: any;
    showSaveButton?: boolean;
    autofocus?: FocusPosition;
}

export default function Index({
    chapters = [],
    level,
    category,
    subject,
    template,
    showSaveButton,
    autofocus,
}: Props) {
    const [previewText, setPreviewText] = useState(
        template?.preview_text || '',
    );
    const [title, setTitle] = useState(template?.title || '');

    const [editor, setEditor] = useState<Editor | null>(null);
    return (
        <AppLayout
            breadcrumbs={breadcrumbs(
                level?.id,
                level?.name,
                category?.id,
                category?.name,
                subject?.id,
                subject?.name,
            )}
        >
            <Head title={`Matières — ${level?.name || ''}`} />

            <div className="mx-auto mb-8 flex max-w-[calc(600px+80px)]! items-center justify-between gap-1.5 px-10 pt-5">
                <div className="flex items-center gap-1.5">
                    <PreviewChapterDialog
                        title={title}
                        previewText={previewText}
                        editor={editor}
                    />
                </div>

                {showSaveButton && (
                    <button
                        className={cn(
                            'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7',
                        )}
                        // disabled={isSaveTemplatePending}
                        onClick={() => {
                            const json = editor?.getJSON();

                            const trimmedTitle = title.trim();
                            const trimmedPreviewText = previewText.trim();
                            if (!trimmedTitle || !json) {
                                toast.error(
                                    'Title, Preview Text and Content are required',
                                );
                                return;
                            }

                            if (trimmedTitle.length < 3) {
                                toast.error(
                                    'Title must be at least 3 characters',
                                );
                                return;
                            }

                            // toast.promise(
                            //     saveTemplate({
                            //         title: trimmedTitle,
                            //         previewText: trimmedPreviewText,
                            //         content: JSON.stringify(json),
                            //     }),
                            //     {
                            //         loading: 'Saving Template...',
                            //         success: 'Template has been saved',
                            //         error: (err) =>
                            //             err?.message || 'Failed to save email',
                            //     },
                            // );
                        }}
                    >
                        {/* {isSaveTemplatePending ? (
                            <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
                        ) : (
                            <SaveIcon className="inline-block size-4 shrink-0 lg:mr-1" />
                        )} */}
                        <span className="hidden lg:inline-block">Save</span>
                    </button>
                )}

                {template?.id && (
                    <div className="flex items-center gap-1.5">
                        {/* <DeleteEmailDialog templateId={template.id} /> */}
                        <button
                            className={cn(
                                'flex min-h-[28px] cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7',
                            )}
                            // disabled={isUpdateTemplatePending ?? false}
                            onClick={() => {
                                const json = editor?.getJSON();

                                const trimmedTitle = title.trim();
                                const trimmedPreviewText = previewText.trim();
                                if (!trimmedTitle || !json) {
                                    toast.error(
                                        'Title, Preview Text and Content are required',
                                    );
                                    return;
                                }

                                if (trimmedTitle.length < 3) {
                                    toast.error(
                                        'Title must be at least 3 characters',
                                    );
                                    return;
                                }

                                // toast.promise(
                                //     updateTemplate({
                                //         title: trimmedTitle,
                                //         previewText: trimmedPreviewText,
                                //         content: JSON.stringify(json),
                                //     }),
                                //     {
                                //         loading: 'Updating Template...',
                                //         success: 'Template has been updated',
                                //         error: (err) =>
                                //             err?.message ||
                                //             'Failed to update email',
                                //     },
                                // );
                            }}
                        >
                            {/* {isUpdateTemplatePending ? (
                                <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
                            ) : (
                                <FileCogIcon className="inline-block size-4 shrink-0 lg:mr-1" />
                            )} */}
                            <span className="hidden lg:inline-block">
                                Update
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <div className="mx-auto mb-5 max-w-[calc(600px+80px)]! px-10">
                <Label className="flex items-center font-normal">
                    <span className="w-20 shrink-0 font-normal text-gray-600 after:ml-0.5 after:text-red-400 after:content-['*']">
                        Titre
                    </span>
                    <Input
                        className="h-auto rounded-none border-none py-2.5 font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Titre du chapitre"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </Label>
            </div>

            <ChapterEditor
                defaultContent={
                    template?.content || JSON.stringify(defaultEmailJSON)
                }
                setEditor={setEditor}
                autofocus={true}
            />
        </AppLayout>
    );
}

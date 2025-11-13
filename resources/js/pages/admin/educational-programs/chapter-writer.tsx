import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import defaultEmailJSON from '@/lib/default-editor-json.json';
import { cn } from '@/lib/utils';
import programs, { updateChapter } from '@/routes/admin/educational-programs';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import '@maily-to/core/style.css';
import { Editor } from '@tiptap/core';
import { Loader2Icon, Redo2Icon, SaveIcon, Undo2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '.';
import { ChapterEditor } from './chapter-editor';
import { Chapter } from './chapters';
import { EducationLevel } from './levels';
import { PreviewChapterDialog } from './preview-chapter-dialog';
import { Subject } from './subjects';

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

type UpdateChapterData = {
    title: string;
    content: string;
};

interface Props {
    category: Category;
    level: EducationLevel;
    subject: Subject;
    chapter?: Chapter;
}

export default function Index({ category, level, subject, chapter }: Props) {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const {
        data: chapterData,
        setData: setChapterData,
        patch: saveChapter,
        processing: isSaveChapterLoading,
        errors,
    } = useForm<UpdateChapterData>({
        title: chapter?.title || '',
        content: chapter?.content || '',
    });

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
                        title={chapterData.title}
                        editor={editor}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            (editor as any)?.chain().focus().undo().run();
                            setCanUndo((editor as any)?.can().undo() ?? false);
                            setCanRedo((editor as any)?.can().redo() ?? false);
                        }}
                        disabled={!canUndo}
                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Annuler (Ctrl+Z)"
                    >
                        <Undo2Icon className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            (editor as any)?.chain().focus().redo().run();
                            setCanUndo((editor as any)?.can().undo() ?? false);
                            setCanRedo((editor as any)?.can().redo() ?? false);
                        }}
                        disabled={!canRedo}
                        className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Rétablir (Ctrl+Shift+Z)"
                    >
                        <Redo2Icon className="h-4 w-4" />
                    </button>
                </div>

                <button
                    className={cn(
                        'flex min-h-7 cursor-pointer items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed max-lg:w-7',
                    )}
                    disabled={isSaveChapterLoading || chapter?.is_active}
                    onClick={() => {
                        if (!chapterData.title) {
                            toast.error('Titre est obligatoire');
                            return;
                        }

                        if (!chapterData.content) {
                            toast.error('Contenu est obligatoire');
                            return;
                        }

                        if (chapterData.title.length < 3) {
                            toast.error(
                                'Le titre doit comporter au moins 3 caractères',
                            );
                            return;
                        }

                        saveChapter(
                            updateChapter.url([
                                category.id,
                                level.id,
                                subject.id,
                                chapter?.id,
                            ]),
                            {
                                onSuccess: () => {
                                    toast.success(
                                        'Chapitre enregistré avec succès',
                                    );
                                },
                                onError: (err) => {
                                    toast.error(
                                        err?.message ||
                                            "Échec de l'enregistrement du chapitre",
                                    );
                                },
                            },
                        );
                    }}
                >
                    {isSaveChapterLoading ? (
                        <Loader2Icon className="inline-block size-4 shrink-0 animate-spin lg:mr-1" />
                    ) : (
                        <SaveIcon className="inline-block size-4 shrink-0 lg:mr-1" />
                    )}
                    <span className="hidden lg:inline-block">Enregistrer</span>
                </button>
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
                        value={chapterData.title}
                        onChange={(event) =>
                            setChapterData('title', event.target.value)
                        }
                    />
                </Label>
            </div>

            <ChapterEditor
                editable={!chapter.is_active}
                defaultContent={
                    chapter?.content || JSON.stringify(defaultEmailJSON)
                }
                setEditor={setEditor}
                setChapterData={setChapterData}
                onEditorUpdate={(editor) => {
                    setCanUndo((editor as any)?.can().undo() ?? false);
                    setCanRedo((editor as any)?.can().redo() ?? false);
                }}
                autofocus={true}
            />
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import defaultEmailJSON from '@/lib/default-editor-json.json';
import programs, {
    updateChapter,
    updateChapterVideo,
} from '@/routes/admin/educational-programs';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Form, Head, useForm, usePage } from '@inertiajs/react';
import '@maily-to/core/style.css';
import { Editor } from '@tiptap/core';
import {
    Download,
    FileQuestion,
    Loader2Icon,
    Paperclip,
    Redo2Icon,
    SaveIcon,
    Undo2Icon,
    Video,
} from 'lucide-react';
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
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
    const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
    const [tempVideoUrl, setTempVideoUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isAdmin = usePage<SharedData>().props.auth.user?.role === 'admin';

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

            <div className="fixed top-[80px] right-6 z-50">
                <div className="relative flex w-30 flex-col gap-2 rounded-2xl bg-white/95 p-2.5 shadow-xl backdrop-blur-md">
                    <PreviewChapterDialog
                        title={chapterData.title}
                        editor={editor}
                    />

                    {chapter && (
                        <>
                            <Dialog
                                open={isVideoDialogOpen}
                                onOpenChange={setIsVideoDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                                            chapter?.video_url
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        title="Ajouter une vidéo"
                                        onClick={() =>
                                            setTempVideoUrl(
                                                chapter?.video_url || '',
                                            )
                                        }
                                    >
                                        <Video className="h-5 w-5" />
                                        {chapter?.video_url && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                                        )}
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <Form
                                        {...updateChapterVideo.form([
                                            category.id,
                                            level.id,
                                            subject.id,
                                            chapter?.id!,
                                        ])}
                                        onSuccess={() => {
                                            setIsVideoDialogOpen(false);
                                            toast.success(
                                                'Vidéo mise à jour avec succès',
                                            );
                                        }}
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                Ajouter une vidéo
                                            </DialogTitle>
                                            <DialogDescription>
                                                Ajoutez un lien YouTube ou Vimeo
                                                pour ce chapitre
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="video-url">
                                                    URL de la vidéo
                                                </Label>
                                                <Input
                                                    id="video-url"
                                                    name="video_url"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    defaultValue={
                                                        chapter?.video_url || ''
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setIsVideoDialogOpen(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button type="submit">
                                                Enregistrer
                                            </Button>
                                        </DialogFooter>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={isAttachmentDialogOpen}
                                onOpenChange={setIsAttachmentDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                                            chapter?.attachment_url
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        title="Ajouter une pièce jointe"
                                    >
                                        <Paperclip className="h-5 w-5" />
                                        {chapter?.attachment_url && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                                        )}
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <Form
                                        method="post"
                                        encType="multipart/form-data"
                                        action={`/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter?.id}/attachment`}
                                        onSuccess={() => {
                                            setIsAttachmentDialogOpen(false);
                                            setSelectedFile(null);
                                            toast.success(
                                                'Pièce jointe téléversée avec succès',
                                            );
                                        }}
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                Ajouter une pièce jointe
                                            </DialogTitle>
                                            <DialogDescription>
                                                Téléversez un fichier (PDF,
                                                Word, Excel, PowerPoint, ZIP -
                                                max 10MB)
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            {chapter?.attachment_url && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        Fichier actuel
                                                    </Label>
                                                    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                                                        <p className="flex-1 truncate text-sm text-slate-700">
                                                            {chapter.attachment_url
                                                                .split('/')
                                                                .pop()}
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`/storage/${chapter.attachment_url}`}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="attachment">
                                                    {chapter?.attachment_url
                                                        ? 'Remplacer le fichier'
                                                        : 'Fichier'}
                                                </Label>
                                                <Input
                                                    id="attachment"
                                                    name="attachment"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                                                    onChange={(e) =>
                                                        setSelectedFile(
                                                            e.target
                                                                .files?.[0] ||
                                                                null,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsAttachmentDialogOpen(
                                                        false,
                                                    );
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={!selectedFile}
                                            >
                                                Téléverser
                                            </Button>
                                        </DialogFooter>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            {/* Quiz Button */}
                            <button
                                type="button"
                                className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                                    chapter?.quiz
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title="Gérer le quiz"
                                onClick={() => {
                                    window.location.href = `/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter?.id}/quiz`;
                                }}
                            >
                                <FileQuestion className="h-5 w-5" />
                                {chapter?.quiz && (
                                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                                )}
                            </button>
                        </>
                    )}

                    <div className="flex flex-col gap-2 rounded-xl bg-slate-50/50 p-1.5">
                        <button
                            type="button"
                            onClick={() => {
                                (editor as any)?.chain().focus().undo().run();
                                setCanUndo(
                                    (editor as any)?.can().undo() ?? false,
                                );
                                setCanRedo(
                                    (editor as any)?.can().redo() ?? false,
                                );
                            }}
                            disabled={!canUndo}
                            className="flex items-center justify-center rounded-lg p-2 text-gray-700 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Annuler (Ctrl+Z)"
                        >
                            <Undo2Icon className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                (editor as any)?.chain().focus().redo().run();
                                setCanUndo(
                                    (editor as any)?.can().undo() ?? false,
                                );
                                setCanRedo(
                                    (editor as any)?.can().redo() ?? false,
                                );
                            }}
                            disabled={!canRedo}
                            className="flex items-center justify-center rounded-lg p-2 text-gray-700 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Rétablir (Ctrl+Shift+Z)"
                        >
                            <Redo2Icon className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        className="flex flex-col items-center justify-center gap-1 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 px-2 py-2.5 text-xs font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSaveChapterLoading}
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

                            const routeParameters = [
                                category.id,
                                level.id,
                                subject.id,
                            ];

                            if (chapter) {
                                routeParameters.push(chapter.id);
                            }

                            saveChapter(updateChapter.url(routeParameters), {
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
                            });
                        }}
                    >
                        {isSaveChapterLoading ? (
                            <>
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                <span>Enregistrement...</span>
                            </>
                        ) : (
                            <>
                                <SaveIcon className="h-4 w-4" />
                                <span>Enregistrer</span>
                            </>
                        )}
                    </button>
                </div>
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
                editable={isAdmin || (chapter ? !chapter.is_active : true)}
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

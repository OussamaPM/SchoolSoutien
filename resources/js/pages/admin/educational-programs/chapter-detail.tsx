import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import programs, { chapterWriter } from '@/routes/admin/educational-programs';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileQuestion, Paperclip, Target } from 'lucide-react';

interface Props {
    category: any;
    level: any;
    subject: any;
    chapter: any;
}

export default function ChapterDetail({
    category,
    level,
    subject,
    chapter,
}: Props) {
    const role = usePage<SharedData>().props.auth.user.role;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString(
            'default',
            {
                month: 'short',
            },
        )} ${date.getFullYear()}`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Programmes', href: programs.levelCategories.url() },
                {
                    title: category?.name || 'Niveaux',
                    href: programs.levels.url(category?.id),
                },
                {
                    title: level?.name || 'Matières',
                    href: programs.subjects.url([level?.id, category?.id]),
                },
                {
                    title: subject?.name || 'Chapitres',
                    href: programs.chapters.url([
                        level?.id,
                        category?.id,
                        subject?.id,
                    ]),
                },
                { title: chapter?.title || 'Détails', href: '#' },
            ]}
        >
            <Head title={`Chapitre — ${chapter?.title || ''}`} />

            <div className="col-span-2 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {chapter?.title}
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Position: #{chapter?.position}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Créé le:{' '}
                            {chapter?.created_at
                                ? formatDate(chapter.created_at)
                                : 'N/A'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Dernière mise à jour:{' '}
                            {chapter?.updated_at
                                ? formatDate(chapter.updated_at)
                                : 'N/A'}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium">
                                    Contenu
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {chapter?.content
                                        ? `${JSON.stringify(chapter.content).length} caractères`
                                        : '0 caractères'}
                                </div>
                                <div className="mt-2">
                                    <Link
                                        as={Button}
                                        href={chapterWriter.url([
                                            category.id,
                                            level.id,
                                            subject.id,
                                            chapter.id,
                                        ])}
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Modifier le contenu
                                    </Link>
                                </div>
                            </div>

                            {chapter?.video_url && (
                                <div>
                                    <div className="text-sm font-medium">
                                        Vidéo
                                    </div>
                                    <video
                                        className="mt-2 w-full rounded-md"
                                        controls
                                        preload="none"
                                        style={{ height: '400px' }}
                                    >
                                        <source
                                            src={chapter.video_url}
                                            type="video/mp4"
                                        />
                                        Votre navigateur ne supporte pas la
                                        lecture de vidéos.
                                    </video>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Exercices
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {chapter?.exercises?.length ?? 0}
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        as={Button}
                                        href={`/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/exercises`}
                                    >
                                        <Target className="mr-2 h-4 w-4" />
                                        Gérer
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Quiz
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {chapter?.quiz
                                            ? chapter.quiz.title
                                            : 'Pas de quiz'}
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        as={Button}
                                        href={`/admin/educational-programs/education-level-categories/${category.id}/${level.id}/subjects/${subject.id}/chapter/${chapter.id}/quiz`}
                                    >
                                        <FileQuestion className="mr-2 h-4 w-4" />
                                        Gérer
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">
                                        Pièce jointe
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {chapter?.attachment_url
                                            ? chapter.attachment_url
                                                  .split('/')
                                                  .pop()
                                            : 'Aucune'}
                                    </div>
                                </div>
                                <div>
                                    <a
                                        download
                                        href={`/storage/${chapter.attachment_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center rounded-md bg-primary p-2 text-sm text-white hover:bg-primary/80"
                                    >
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        {chapter?.attachment_url
                                            ? 'Télécharger'
                                            : 'Ajouter'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { helperBlockGroup } from '@/lib/chapter-editor-blocks/helpers';
import { listBlockGroup } from '@/lib/chapter-editor-blocks/list';
import { typographyBlockGroup } from '@/lib/chapter-editor-blocks/typography';
import { cn } from '@/lib/utils';
import type { FocusPosition, Editor as TiptapEditor } from '@tiptap/core';
import { Loader2Icon } from 'lucide-react';
import { lazy, Suspense, useRef, useState } from 'react';

const Editor = lazy(() =>
    import('@maily-to/core').then((module) => ({
        default: module.Editor,
    })),
);

type EditorProps = {
    defaultContent: any;
    setEditor: (editor: TiptapEditor) => void;
    setChapterData: (field: string, value: string) => void;
    onEditorUpdate?: (editor: TiptapEditor) => void;
    autofocus?: FocusPosition;
    editable?: boolean;
};

export function ChapterEditor(props: EditorProps) {
    const {
        defaultContent,
        setEditor,
        setChapterData,
        onEditorUpdate,
        autofocus,
        editable,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <>
            {isLoading && (
                <div className="flex w-full items-center justify-center py-10">
                    <Loader2Icon className="h-8 w-8 animate-spin stroke-[2.5] text-gray-500" />
                </div>
            )}
            <Suspense>
                <Editor
                    editable={editable ?? true}
                    config={{
                        hasMenuBar: false,
                        wrapClassName: cn('editor-wrap', isLoading && 'hidden'),
                        bodyClassName: '!mt-0 !border-0 !p-0',
                        contentClassName: `editor-content mx-auto max-w-[calc(800px+80px)]! px-10! pb-10!`,
                        toolbarClassName: 'flex-wrap !items-start',
                        spellCheck: false,
                        autofocus,
                        immediatelyRender: false,
                    }}
                    blocks={[
                        {
                            title: 'Aide au formatage',
                            commands: typographyBlockGroup.concat(
                                listBlockGroup,
                                helperBlockGroup,
                            ),
                        },
                    ]}
                    contentJson={
                        defaultContent
                            ? JSON.parse(defaultContent as string)
                            : null
                    }
                    onCreate={(editor: any) => {
                        setIsLoading(false);
                        setEditor(editor);
                        onEditorUpdate?.(editor);
                    }}
                    onUpdate={(editor: any) => {
                        setEditor(editor);

                        if (debounceTimerRef.current) {
                            clearTimeout(debounceTimerRef.current);
                        }

                        debounceTimerRef.current = setTimeout(() => {
                            const nextContent = JSON.stringify(
                                editor?.getJSON() ?? {},
                            );
                            setChapterData('content', nextContent);
                        }, 500); // 500ms debounce delay

                        onEditorUpdate?.(editor);
                    }}
                />
            </Suspense>
        </>
    );
}

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, type RefObject } from 'react';
import { toast } from 'sonner';

type ChapterPreviewIFrameProps = {
    innerHTML: string;
    isServer?: boolean;
    showOpenInNewTab?: boolean;
    wrapperClassName?: string;
} & React.HTMLProps<HTMLIFrameElement>;

function renderHTMLToIFrame(
    ref: RefObject<HTMLIFrameElement | null>,
    html: string,
) {
    if (!ref || !ref?.current) {
        return;
    }

    const doc = ref.current.contentDocument;
    if (!doc) {
        return;
    }

    doc.open();
    doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
    doc.close();
}

export function ChapterPreviewIFrame(props: ChapterPreviewIFrameProps) {
    const {
        innerHTML,
        isServer,
        showOpenInNewTab = true,
        wrapperClassName,
        ...defaultProps
    } = props;

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!iframeRef.current || isServer) {
            return;
        }

        renderHTMLToIFrame(iframeRef, innerHTML);
    }, [innerHTML, iframeRef, isServer]);

    function handleOpen() {
        if (innerHTML.trim().length === 0) {
            toast.error('There is no data to preview.');
            return;
        }

        const newWindow = window.open('about:blank', '_blank');
        newWindow?.focus();

        const newDoc = newWindow?.document;
        if (!newDoc) {
            toast.error('Something went wrong.');
            return;
        }

        newDoc.open();
        newDoc.write(innerHTML);
        newDoc.close();
    }

    return (
        <div className={cn('relative', wrapperClassName)}>
            <iframe
                title="Chapter preview"
                {...defaultProps}
                onLoad={() => {
                    if (isServer) {
                        return;
                    }

                    renderHTMLToIFrame(iframeRef, innerHTML);
                }}
                ref={iframeRef}
                srcDoc={isServer ? innerHTML : ''}
            />

            {showOpenInNewTab ? (
                <Button
                    className="absolute right-0 bottom-0 h-8 cursor-pointer gap-1.5 rounded-none rounded-tl-md border-t border-l border-gray-200 text-sm font-normal hover:bg-gray-50"
                    onClick={handleOpen}
                    type="button"
                    variant="secondary"
                >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    <span>Ouvrir dans un nouvel onglet</span>
                </Button>
            ) : null}
        </div>
    );
}

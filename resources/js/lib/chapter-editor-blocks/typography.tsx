import {
    DivideIcon,
    EraserIcon,
    Heading1,
    Heading3,
    Text,
    TextQuote,
} from 'lucide-react';
import { BlockItem } from './types';

const heading1: BlockItem = {
    title: 'Titre',
    description: 'Grand titre.',
    searchTerms: ['h1', 'title', 'big', 'large', 'grand', 'titre'],
    icon: <Heading1 className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run();
    },
};

const heading3: BlockItem = {
    title: 'Sous-titre',
    description: 'Petit titre.',
    searchTerms: [
        'h3',
        'subtitle',
        'small',
        'little',
        'sous',
        'titre',
        'petit',
    ],
    icon: <Heading3 className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run();
    },
};

const text: BlockItem = {
    title: 'Texte',
    description: 'Commencez à taper avec du texte brut.',
    searchTerms: ['p', 'paragraph', 'texte', 'paragraphe'],
    icon: <Text className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode('paragraph', 'paragraph')
            .run();
    },
};

const hardBreak: BlockItem = {
    title: 'Saut de ligne',
    description: 'Ajoute un saut de ligne.',
    searchTerms: ['break', 'line', 'saut', 'ligne'],
    icon: <DivideIcon className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).setHardBreak().run();
    },
};

const blockquote: BlockItem = {
    title: 'Citation',
    description: 'Ajouter une citation.',
    searchTerms: ['quote', 'blockquote', 'citation'],
    icon: <TextQuote className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
};

const clearLine: BlockItem = {
    title: 'Effacer la ligne',
    description: 'Efface la ligne actuelle.',
    searchTerms: ['clear', 'line', 'delete', 'supprimer', 'effacer'],
    icon: <EraserIcon className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().selectParentNode().deleteSelection().run();
    },
};

export const typographyBlockGroup: BlockItem[] = [
    heading1,
    heading3,
    text,
    hardBreak,
    blockquote,
    clearLine,
];

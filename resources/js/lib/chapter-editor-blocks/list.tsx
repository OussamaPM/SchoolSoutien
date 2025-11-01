import { List, ListOrdered } from 'lucide-react';
import { BlockItem } from './types';

const bulletList: BlockItem = {
    title: 'Bullet Liste',
    description: 'Créer une liste à puces simple.',
    searchTerms: ['unordered', 'point', 'puces', 'liste'],
    icon: <List className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
};

const orderedList: BlockItem = {
    title: 'Liste Numérotée',
    description: 'Créer une liste avec des numéros.',
    searchTerms: ['ordered', 'numérotée', 'numéros', 'liste'],
    icon: <ListOrdered className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
};

export const listBlockGroup: BlockItem[] = [bulletList, orderedList];

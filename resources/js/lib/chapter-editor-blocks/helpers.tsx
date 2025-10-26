import { ImageIcon, Minus } from 'lucide-react';
import { BlockItem } from './types';

export const divider: BlockItem = {
    title: 'Diviseur',
    description: 'Ajouter un diviseur horizontal.',
    searchTerms: ['diviseur', 'ligne', 'divider', 'horizontal'],
    icon: <Minus className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
};

const image: BlockItem = {
    title: 'Image',
    description: 'Full width image',
    searchTerms: ['image'],
    icon: <ImageIcon className="mly:h-4 mly:w-4" />,
    command: ({ editor, range }) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).setImage({ src: '' }).run();
    },
};

export const helperBlockGroup: BlockItem[] = [
    /*image, divider*/
];

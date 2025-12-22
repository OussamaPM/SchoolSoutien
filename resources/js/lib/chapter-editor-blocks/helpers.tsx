import { ImageIcon, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { selectImageFile } from '../upload-utils';
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

export const helperBlockGroup = (
    uploadImage?: (file: File) => Promise<string>,
) => {
    const image: BlockItem = {
        title: 'Image',
        description: 'Téléverser une image depuis votre ordinateur',
        searchTerms: ['image', 'photo', 'picture', 'upload'],
        icon: <ImageIcon className="mly:h-4 mly:w-4" />,
        command: async ({ editor, range }) => {
            try {
                // Open file picker
                const file = await selectImageFile();

                if (!file) {
                    return; // User cancelled
                }

                if (!uploadImage) {
                    toast.error('Fonction de téléversement non disponible');
                    return;
                }

                // Show loading toast
                const loadingToast = toast.loading(
                    "Téléversement de l'image...",
                );

                try {
                    // Upload to server
                    const uploadedUrl = await uploadImage(file);

                    // Insert image with uploaded URL
                    // @ts-ignore
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setImage({ src: uploadedUrl })
                        .run();

                    toast.success('Image ajoutée avec succès', {
                        id: loadingToast,
                    });
                } catch (uploadError) {
                    toast.error("Erreur lors du téléversement de l'image", {
                        id: loadingToast,
                    });
                    throw uploadError;
                }
            } catch (error) {
                console.error('Error adding image:', error);
            }
        },
    };

    return [image, divider];
};

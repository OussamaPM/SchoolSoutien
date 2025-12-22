/**
 * Opens a file picker dialog and returns the selected file
 */
export const selectImageFile = (): Promise<File | null> => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            resolve(file);
        };
        
        input.oncancel = () => {
            resolve(null);
        };
        
        input.click();
    });
};

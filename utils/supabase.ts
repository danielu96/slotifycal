import { createClient } from '@supabase/supabase-js';

const bucket = 'temp-reservations';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export const uploadImage = async (image: File) => {
    const timestamp = Date.now();
    const newName = `${timestamp}-${image.name}`;
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(newName, image, {
            cacheControl: '3600',
        });
    if (!data) throw new Error('Image upload failed');
    return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
import { supabase } from "../supabase/supabase";


export const InsertRecipe = async ({ UserId, Image_Url, Title, Category, IsFavorite, Likes, PreparationTime, Serving, Ingredients, Steps }) => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .insert({ userId: UserId, image_Url: Image_Url, title: Title, category: Category, isFavorite: IsFavorite, likes: Likes, preparationTime: PreparationTime, serving: Serving, ingredients: Ingredients, steps: Steps })
            .select()

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
}

export const InsertRecipeImage = async ({ fileName, FileValue }) => {
    try {
        const { data, error } = await supabase
            .storage
            .from('recipe-images')
            .upload(`public/${fileName}`, FileValue, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) throw error;
        return data;
    } catch (error) {
        return error;
    }
}

export const GetPublicUrl = async ({ FilePath }) => {
    try {
        const { data } = supabase
            .storage
            .from('recipe-images')
            .getPublicUrl(`${FilePath}`)

        return data;
    } catch (error) {
        return error;

    }
}

export const UpdateRecipe = async ({ Image_Url, id }) => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .update({ 'image_Url': Image_Url })
            .eq('id', id)
            .select()

        if (error) throw error;
        return data;
    } catch (error) {
        return error;
    }
}

export const GetRecipeData = async () => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .select()

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
}

export const FilterData = async ({ dataSet, Id }) => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .select()
            .eq(dataSet, Id)

        if (error) throw error;

        return data;
    } catch (error) {
        return error;

    }
}


export const UpdateFavorite = async ({ IsFavorite, RecipeId }) => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .update({ 'isFavorite': IsFavorite })
            .eq("id", RecipeId)
            .select()

        if (error) throw error;
        return data;

    } catch (error) {
        return error;

    }
}


export const DeleteRecipe = async ({ Id }) => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .delete()
            .eq('id', Id)
            .select()
        if (error) throw error;
        return data;
    } catch (error) {
        return error;

    }
}

export const GetAllRecipes = async () => {
    try {
        const { data, error } = await supabase
            .from('recipies')
            .select()

        if (error) throw error;
        return data;
    } catch (error) {
        return error;

    }
}

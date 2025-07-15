import { supabase } from "../supabase/Supabase.js";

export const CreateUser = async ({ Email, Password, Name }) => {
    try {
        const { data, error } = await supabase.auth.signUp(
            {
                email: Email,
                password: Password,
                options: {
                    data: {
                        name: Name,

                    }
                }
            }
        )
        if (error) {
            return error;
        }

        console.log("Signup Success:", data);
        return data;
    } catch (err) {
        console.error("CreateUser Catch Error:", err.message);
        throw err;
    }
};

export const SignInNewUser = async ({ Email, Password }) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: Email,
            password: Password,
        })

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
}

export const SignOutUser = async () => {
    try {
        const { data, error } = await supabase.auth.signOut()
        return data;

    } catch (error) {
        return error;

    }
}

export const InsertUser = async ({ Name, Email, UserID }) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({ name: Name, email: Email, userId: UserID })
            .select()

        if (error) throw error;

        return data;
    } catch (error) {
        return error;

    }
}

export const CurrentUser = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        return data;
    } catch (error) {
        return error;
    }
}

export const UpdateUser = async ({ Name, Phone, Loc, ProfilePhoto, UserId }) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ 'name': Name, 'phone_number': Phone, 'location': Loc, 'profile_photo': ProfilePhoto })
            .eq('userId', UserId)
            .select()

        if (error) throw error;

        return data;
    } catch (error) {
        return error;

    }
}

export const GetAllUser = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select()

        if (error) throw error;
        return data;
    } catch (error) {
        return error;

    }
}

export const FilterUser = async ({ UserId }) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('userId', UserId)

        if (error) throw error;
        return data;
    } catch (error) {
        return error;

    }
}

export const InsertUserImage = async ({ fileName, FileValue }) => {
    try {
        const { data, error } = await supabase
            .storage
            .from('user-images')
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

export const GetUserPublicUrl = async ({ FilePath }) => {
    try {
        const { data } = supabase
            .storage
            .from('user-images')
            .getPublicUrl(`${FilePath}`)

        return data;
    } catch (error) {
        return error;

    }
}


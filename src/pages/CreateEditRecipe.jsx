import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InsertRecipe, InsertRecipeImage, GetPublicUrl, UpdateRecipe } from '../lib/recipe';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useState } from 'react';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  category: yup.string().required('Category is required'),
  ingredients: yup.string().required('Ingredients are required'),
  steps: yup.string().required('Steps are required'),
  prep_time: yup.string().required('Preparation time is required'),
  servings: yup.number().required('Servings is required').positive().integer(),
  image_file: yup.mixed().required('An image is required')
    .test(
      'fileSize',
      'File too large (max 5MB)',
      (value) => !value || (value && value[0]?.size <= 5 * 1024 * 1024)
    )

});

export default function CreateEditRecipe() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      let insertedData = await InsertRecipe({ Title: data.title, Ingredients: data.ingredients, Serving: data.servings, Category: data.category, Steps: data.steps, PreparationTime: data.prep_time, UserId: user.id, IsFavorite: false, Likes: 0 })


      if (insertedData) {
        try {
          if (data.image_file.length > 0) {
            let insertImageData = await InsertRecipeImage({ fileName: data.image_file[0].name, FileValue: data.image_file[0] })
            try {
              let getUrl = await GetPublicUrl({ FilePath: insertImageData.path })
              if (getUrl) {
                let updatedData = await UpdateRecipe({ Image_Url: getUrl.publicUrl, id: insertedData[0].id });
                if (updatedData) {
                  Swal.fire({
                    title: "Recipe Created Successfully!",
                    icon: "success",
                    draggable: true
                  });
                  setIsLoading(false)
                  reset();
                }
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: `Insert Error`,
                text: `Insert Error`,

              });
              setIsLoading(false)

            }
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `Insert Error`,
            text: `Insert Error`,

          });
          setIsLoading(false)

        }
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Insert Error`,
        text: `Insert Error`,

      });
      setIsLoading(false)

    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        Create New Recipe
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select a category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Vegetarian">Vegetarian</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Recipe Image</label>

          {/* Upload area - wrapped in label for better accessibility */}
          <label className="
    flex flex-col items-center justify-center
    w-full h-40 border-2 border-dashed rounded-lg
    border-amber-300 bg-amber-50 hover:bg-amber-100
    cursor-pointer transition-colors duration-200
    relative
  ">
            <div className="flex flex-col items-center justify-center text-amber-700">
              <svg
                className="w-10 h-10 mb-3 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p className="text-sm font-medium text-amber-800">
                Click to upload image
              </p>
              <p className="text-xs text-amber-600 mt-1">
                PNG, JPG, or JPEG (Max 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              {...register('image_file')}
            />
          </label>

          {/* Error message display */}
          {errors.image_file && (
            <p className="mt-1 text-sm text-red-600">
              {errors.image_file?.message}
            </p>
          )}

          {/* Image preview placeholder */}
          {watch('image_file')?.length > 0 && (
            <div className="mt-3">
              <div className="h-40 w-full bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600">Image selected: {watch('image_file')[0].name}</span>
              </div>
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Preparation Time</label>
            <input
              {...register('prep_time')}
              placeholder="e.g. 30 mins"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.prep_time && <p className="text-red-500 text-sm">{errors.prep_time.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Servings</label>
            <input
              type="number"
              {...register('servings')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.servings && <p className="text-red-500 text-sm">{errors.servings.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Ingredients (one per line)</label>
          <textarea
            {...register('ingredients')}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Steps (one per line)</label>
          <textarea
            {...register('steps')}
            rows={8}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.steps && <p className="text-red-500 text-sm">{errors.steps.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div> : "Create Recipe"}

        </button>
      </form>
    </div>
  );
}
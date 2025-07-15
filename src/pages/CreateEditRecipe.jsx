import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import { InsertRecipe, InsertRecipeImage, GetPublicUrl, UpdateRecipe } from '../lib/recipe';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

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
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {

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
                  reset();
                }
              }
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: `Insert Error`,
                text: `Insert Error`,

              });
            }
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: `Insert Error`,
            text: `Insert Error`,

          });
        }
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Insert Error`,
        text: `Insert Error`,

      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        {isEdit ? 'Edit Recipe' : 'Create New Recipe'}
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

        {/* <div>
          <label className="block text-gray-700 mb-1">Image URL</label>
          <input
            {...register('image_url')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
        </div> */}

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
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isEdit ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}
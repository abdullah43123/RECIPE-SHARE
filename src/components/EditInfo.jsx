import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaTimes, FaCamera, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { GetUserPublicUrl, InsertUserImage, UpdateUser } from '../lib/users';
import Swal from 'sweetalert2';
const profileSchema = yup.object().shape({
  name: yup.string(),
  location: yup.string(),
  phone: yup.string(),
  photo: yup.mixed()
});

export default function AccountEditModal({ isOpen, onClose, user }) {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      location: user?.location || '',
      phone: user?.phone || '',
      photo: null
    }
  });

  const photoPreview = watch('photo');
  const existingPhoto = user?.photoUrl;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('photo', file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (data) {
      try {
        let insertPhoto = await InsertUserImage({ fileName: data.photo.name, FileValue: data.photo })
        if (insertPhoto) {
          try {
            let getUrl = await GetUserPublicUrl({ FilePath: insertPhoto.path })
            if (getUrl) {
              try {
                let updatedData = await UpdateUser({ Name: data.name, Phone: data.phone, Loc: data.location, ProfilePhoto: getUrl.publicUrl, UserId: user.id });
                if (updatedData) {
                  Swal.fire({
                    title: "Data Edited Successfully!",
                    icon: "success",
                    draggable: true
                  });
                  reset();
                }

              } catch (error) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!"
                });
                reset();
                return;
              }
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!"
            });
            reset();
            return;
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
        reset();
        return;
      }



    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Photo Upload */}
          <div className="mb-6 flex flex-col items-center">
            <label className="relative cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={URL.createObjectURL(photoPreview)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : existingPhoto ? (
                  <img
                    src={existingPhoto}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-amber-500 text-3xl" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full">
                <FaCamera size={14} />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('photo')}
                onChange={handleFileChange}
              />
            </label>
            <span className="text-sm text-amber-700 mt-2">Click to change photo</span>
            {errors.photo && (
              <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>
            )}
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label className="flex items-center text-gray-700 mb-2">
              <FaUser className="mr-2 text-amber-600" />
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.name ? 'border-red-300' : 'border-amber-200'
                }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div className="mb-4">
            <label className="flex items-center text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2 text-amber-600" />
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.location ? 'border-red-300' : 'border-amber-200'
                }`}
              placeholder="Your location"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="flex items-center text-gray-700 mb-2">
              <FaPhone className="mr-2 text-amber-600" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.phone ? 'border-red-300' : 'border-amber-200'
                }`}
              placeholder="+923210000052"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
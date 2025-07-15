import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountEditModal from '../components/EditInfo';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaHistory, FaSignOutAlt, FaUtensils } from 'react-icons/fa';
import { FilterUser } from '../lib/users';
import { useNavigate } from 'react-router-dom';
import { SignOutUser } from '../lib/users';

export default function Account() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState('');

    useEffect(() => {
        async function getData() {
            let data = await FilterUser({ UserId: user.id })
            setUserData(data[0]);
        }
        getData()
    }, [user])

    const navigate = useNavigate();

    async function signOut() {
        setTimeout(async () => {
            await SignOutUser();
            navigate('/login');
        }, 2000);
    }


    return (
        <div className="min-h-screen bg-amber-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-900 mb-2">My Account</h1>
                    <p className="text-amber-700">Manage your profile and preferences</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="md:flex">
                        {/* Avatar Section */}
                        <div className="md:w-1/3 bg-amber-100 p-6 flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full bg-amber-200 overflow-hidden">
                                    <img
                                        src={userData.profile_photo}
                                        alt="User profile photo"
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            </div>


                            <h2 className="text-xl font-semibold text-amber-900">{userData.email}</h2>
                            <p className="text-sm text-amber-600">Member since 2023</p>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-2/3 p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-amber-900 mb-4 border-b border-amber-100 pb-2">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-amber-700 mb-1">Full Name</label>
                                        <p className="text-gray-900">{userData?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-amber-700 mb-1">Email</label>
                                        <p className="text-gray-900">{userData?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-amber-700 mb-1">Location</label>
                                        {/* <p className="text-gray-900">New York, USA</p> */}
                                        <p className="text-gray-900">{userData?.location}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-amber-700 mb-1">Phone</label>
                                        {/* <p className="text-gray-900">+1 (555) 123-4567</p> */}
                                        <p className="text-gray-900">{userData?.phone_number}</p>
                                    </div>
                                </div>
                            </div>

                            {/* {showHistory ? (
                                <RecipeHistory onBack={() => setShowHistory(false)} />
                            ) : (
                                // Your normal account view
                                <button
                                    onClick={() => setShowHistory(true)}
                                    className="text-amber-600 hover:text-amber-700"
                                >
                                    View History →
                                </button>
                            )} */}
                            <button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition" onClick={() => setIsModalOpen(true)}>Edit Profile</button>
                            {/* <button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition" >
                                Edit Profile
                            </button> */}
                            <AccountEditModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                user={user}
                            />
                            {/* <Link to={'/recipe_history'} className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition">Edit Profile</Link> */}
                        </div>
                    </div>
                </div>

                {/* Account Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* My Recipes */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-amber-100 p-3 rounded-lg mr-4">
                                <FaUtensils className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-medium text-amber-900">My Recipes</h3>
                        </div>
                        <p className="text-gray-600 mb-4">View and manage all your submitted recipes</p>
                        {/* <button className="text-amber-600 hover:text-amber-700 font-medium">
                            View Recipes →
                        </button> */}
                        <Link className="text-amber-600 hover:text-amber-700 font-medium" to={'my-recipes'}>View Recipes →</Link>
                    </div>

                    {/* Activity History */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-amber-100 p-3 rounded-lg mr-4">
                                <FaHistory className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-medium text-amber-900">Activity History</h3>
                        </div>
                        <p className="text-gray-600 mb-4">See your recent activity and interactions</p>
                        {/* <button className="text-amber-600 hover:text-amber-700 font-medium">
                            View History →
                        </button> */}
                        <Link className="text-amber-600 hover:text-amber-700 font-medium" to={'recipe_history'}>View History →</Link>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-300">
                    <h3 className="text-lg font-medium text-red-700 mb-4">Account Actions</h3>
                    <div className="space-y-4">
                        <button onClick={signOut} className="flex items-center text-red-600 hover:text-red-700">
                            <FaSignOutAlt className="mr-2" />
                            Sign Out
                        </button>
                        <button className="text-sm text-red-500 hover:text-red-600">
                            Request Account Deletion
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
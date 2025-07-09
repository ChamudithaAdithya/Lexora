import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userProfileHandleService from '../../services/userProfileHandleService';
import Alert from '../../component/template/alert/Alert';
import SignUp from '../../assets/images/SignUp.jpg'; 
// Assuming the image path is correct
export default function SignUpPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlertMessage({ message: '', type: '' });

    try {
      const response = await userProfileHandleService.createUser(formData);

      if (response.data.message == 'User already exists') {
        setUserAlreadyExists(true);
      } else if (response.data.message) {
        setAlertMessage({ type: 'success', message: response.data.message });
        navigate('/signin');
      } else {
        console.log(response.data);
        setUserAlreadyExists(false);
        setAlertMessage({ type: 'error', message: response.data.error || 'Something went wrong' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Server error. Please try again later.' });
    }
  };

  return (
    <>
      {alertMessage.message && <Alert message={alertMessage.message} type={alertMessage.type} />}
      <section class="bg-white">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
            <div class="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
              <p class="mt-2 text-base text-gray-600">
                Already have an account?{' '}
                <Link to={'/signin'}>
                  <a
                    href="#"
                    title=""
                    class="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700"
                  >
                    Login
                  </a>
                </Link>
              </p>

              <form onSubmit={(e) => handleSubmit(e)} method="POST" class="mt-8">
                <div class="space-y-5">
                  <div>
                    <label class="text-base font-medium text-gray-900"> Username </label>
                    <div class="mt-2.5">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        id="username"
                        required
                        placeholder="Enter your username"
                        class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify object-center">
                      <label class="text-base font-medium text-gray-900"> Email address </label>
                      {userAlreadyExists && <p class="ml-4 text-s text-red-600">* Email Address Already exists</p>}
                    </div>

                    <div class="mt-2.5">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        id="email"
                        placeholder="Enter email to get started"
                        class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-base font-medium text-gray-900"> Password </label>
                    <div class="mt-2.5">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        minLength={8}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      id="signup"
                      class="inline-flex cursor-pointer items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                    >
                      Create free account
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div>
            <div>
              <img src={SignUp} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

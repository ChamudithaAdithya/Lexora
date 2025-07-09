import React, { useState } from 'react';
import { authService } from '../../services/AuthService';
import Alert from '../../component/template/alert/Alert';
import { Link, useNavigate } from 'react-router-dom';
import signIn from '../../assets/images/Signin.jpg';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAllertType] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlertMessage('');
    setAllertType('');
    try {
      console.log('Hello');
      const response = await authService.login(email, password);
      console.log(response);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      console.log('Hello', JSON.stringify(err.error));
      setError(err.error || 'Login failed');
      setAllertType('error');
      setAlertMessage(JSON.stringify(err.error));
    }
  };
  return (
    <>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign in</h2>
              <div className="flex justify object-center m-2 ">
                <p className="text-base text-gray-600 mr-1">Don’t have an account? </p>
                <Link to={'/signUpPage'}>
                  <div
                    href=""
                    title=""
                    className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700"
                  >
                    Create a free account
                  </div>
                </Link>
              </div>

              {!alertMessage ? (
                <p className="mt-2 text-base text-red-0 opacity-0">Invalid Email or Password</p>
              ) : (
                <p className="mt-2 text-base text-red-600">Invalid Email or Password</p>
              )}

              <form onSubmit={handleLogin} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      {' '}
                      Email address{' '}
                    </label>
                    <div className="mt-2.5">
                      <input
                        required={true}
                        type="email"
                        name="signinemail"
                        id="signinemail"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email to get started"
                        className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="" className="text-base font-medium text-gray-900">
                        {' '}
                        Password{' '}
                      </label>

                      <Link to={''}>Forgot password? </Link>
                    </div>
                    <div className="mt-2.5">
                      <input
                        type="password"
                        name="signinpassword"
                        onChange={(e) => setPassword(e.target.value)}
                        id="signinpassword"
                        placeholder="Enter your password"
                        className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      id="loginButton"
                      onClick={(e) => handleLogin(e)}
                      className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                    >
                      Log in
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className=" bg-gray-50 sm:px-6 lg:px-8">
            <div>
              <img className="w-auto mx-auto" src={signIn} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import React, {useRef} from 'react';
import NavBar from '../../component/template/NavBar';
import Footer from '../Home/Footer';
import emailjs from '@emailjs/browser';

export default function ContactUsPage() {
  const form = useRef();

  const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm("service_eiquyk9", "template_a05h22x", form.current, "yo4avt31bObRTsZln")
    .then(() => {
      alert("Message sent successfully!");
      form.current.reset();
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    });
};
  return (
    <div>
      <NavBar activeNavMenu={'contactUs'} />
      <section class="py-10 bg-gray-100 sm:py-16 lg:py-24">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">Contact us</h2>
          </div>

          <div class="max-w-5xl mx-auto mt-12 sm:mt-16">
            <div class="mt-6 overflow-hidden bg-white rounded-xl">
              <div class="px-6 py-12 sm:p-12">
                

                <form ref={form} onSubmit={sendEmail} action="#" method="POST" class="mt-14">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Your name{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <input
                          type="text"
                          name="name"
                          id=""
                          placeholder="Enter your full name"
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Email address{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <input
                          type="email"
                          name="email"
                          id=""
                          placeholder="Enter your full name"
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Phone number{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <input
                          type="tel"
                          name="phone_number"
                          id=""
                          placeholder="Enter your full name"
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Company name{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <input
                          type="text"
                          name="company_name"
                          id=""
                          placeholder="Enter your full name"
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                        />
                      </div>
                    </div>

                    <div class="sm:col-span-2">
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Subject{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <input
                          name="subject"
                          id=""
                          placeholder=""
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md resize-y focus:outline-none focus:border-blue-600 caret-blue-600"
                          type="text"
                        ></input>
                      </div>
                    </div>

                    <div class="sm:col-span-2">
                      <label for="" class="text-base font-medium text-gray-900">
                        {' '}
                        Message{' '}
                      </label>
                      <div class="mt-2.5 relative">
                        <textarea
                          name="message"
                          id=""
                          placeholder=""
                          class="block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md resize-y focus:outline-none focus:border-blue-600 caret-blue-600"
                          rows="4"
                        ></textarea>
                      </div>
                    </div>

                    <div class="sm:col-span-2">
                      <button
                        type="submit"
                        class="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import React from 'react';
import NavBar from '../../component/template/NavBar';
import Footer from '../Home/Footer';
import AboutUs from '../../assets/images/AboutUs.jpg';
import Adithya from '../../assets/images/Adithya.jpg';
import Anjali from '../../assets/images/Anjali.jpg';
import Bishar from '../../assets/images/Bishar.jpg';
import Ayesha from '../../assets/images/Ayesha.jpg';
import Nishan from '../../assets/images/Nishan.jpg';

export default function AboutUsPage() {
  return (
    <div>
      <NavBar activeNavMenu={'aboutUs'} />
      <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">About Us</h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-500">
              Learn more about our journey, our mission and the team that makes it all happen.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
            <div className="overflow-hidden bg-white rounded-xl">
              <div className="p-6 sm:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left side - Image */}
                  <div className="relative h-64 md:h-full">
                    <div className="h-64 md:h-full w-full rounded-lg overflow-hidden">
                      <img 
                        src={AboutUs} 
                        alt="About Our Company" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-gray-900">Our Story</h3>
                    <p className="text-base text-gray-600">
                      Founded in 2020, our company began with a simple vision: to create innovative solutions that address real-world problems and make a positive impact on people's lives.
                    </p>
                    <p className="text-base text-gray-600">
                      What started as a small team with big ideas has grown into a thriving organization with clients across the globe. We pride ourselves on our commitment to quality, creativity, and customer satisfaction.
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 pt-4">Our Mission</h3>
                    <p className="text-base text-gray-600">
                      We are dedicated to delivering exceptional products and services that exceed expectations and help our clients achieve their goals. Through continuous innovation and a customer-centric approach, we aim to be leaders in our industry.
                    </p>
                    <div className="pt-4">
                      <a
                        href="#"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Section (Optional) */}
            <div className="mt-12 overflow-hidden bg-white rounded-xl">
              <div className="p-6 sm:p-12">
                <h3 className="text-3xl font-semibold text-center text-gray-900 mb-8">Our Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Team Member 1 */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                      <img 
                        src={Adithya}
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900">H. M. G. C. A. Herath</h4>
                    <p className="text-sm text-gray-500">Leader</p>
                  </div>
                  
                  {/* Team Member 2 */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                      <img 
                        src={Anjali}
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900">G. M. A. S. Aponsu</h4>
                    <p className="text-sm text-gray-500">Ungergraduate</p>
                  </div>
                  
                  {/* Team Member 3 */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                      <img 
                        src={Nishan} 
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900">R. D. N. P. Kumara</h4>
                    <p className="text-sm text-gray-500">Ungergraduate</p>
                  </div>

                  {/* Team Member 4 */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                      <img 
                        src={Ayesha}
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900">N. H. A. Haizoom</h4>
                    <p className="text-sm text-gray-500">Ungergraduate</p>
                  </div>

                  {/* Team Member 5 */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                      <img 
                        src={Bishar}
                        alt="Team Member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-gray-900">N. M. Bishar</h4>
                    <p className="text-sm text-gray-500">Ungergraduate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
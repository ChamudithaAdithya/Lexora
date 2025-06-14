import React from 'react';
import NavBar from '../../component/template/NavBar';
import Footer from './Footer';
import Feedback from '../../component/template/Feedback';
import SidebarSub from '../../component/template/SidebarSub';
import TopHeader from '../../component/template/TopHeader';

export default function FeedbackPage() {
  return (
    <>
      <div className="flex overflow-hidden ">
            <SidebarSub />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopHeader HeaderMessage={'Feedback Form'} />
      <Feedback />
      </div>
      </div>
      
    </>
  );
}

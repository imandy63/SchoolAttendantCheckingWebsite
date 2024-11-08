import React from 'react';
import MainHeader from '@/components/MainHeader';
import AccordionMenu from '../_components/AccordionMenu';
import StudentInfo from '../_components/StudentInfo';

const InfoPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <MainHeader />

            <div className="flex flex-1">
                {/* Sidebar (Accordion Menu) */}
                <div className="w-64 bg-gray-100">
                    <AccordionMenu />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 bg-white">
                    <StudentInfo />
                </div>
            </div>
        </div>
    );
};

export default InfoPage;

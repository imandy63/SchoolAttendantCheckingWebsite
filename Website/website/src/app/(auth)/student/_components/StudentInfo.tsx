import React from 'react';

const StudentInfo: React.FC = () => {
    return (
        <div className="flex p-8 bg-white shadow-md rounded-lg space-x-12">
            {/* Phần Avatar và Thông tin cơ bản */}
            <div className="flex flex-col items-center space-y-4">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <span>Avatar</span> {/* Thay bằng <img src="URL của ảnh" alt="Avatar" /> nếu có URL ảnh */}
                </div>

                {/* Thông tin cơ bản */}
                <div className="text-left">
                    <p><strong>MSSV:</strong> <span className="font-semibold">2001215828</span></p>
                    <p><strong>Họ tên:</strong> <span className="font-semibold">Phạm Hồ Đăng Huy</span></p>
                    <p><strong>Giới tính:</strong> <span className="font-semibold">Nam</span></p>
                </div>
            </div>

            {/* Thông tin học vấn */}
            <div className="flex flex-col space-y-2 text-gray-700">
                <h2 className="text-xl font-bold mb-4">Thông tin học vấn</h2>
                <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                    <p><strong>Trạng thái:</strong> Đang học</p>
                    <p><strong>Mã hồ sơ:</strong> 2001215828</p>
                    <p><strong>Lớp học:</strong> 12DHTH01</p>
                    <p><strong>Ngày vào trường:</strong> 18/9/2021</p>
                    <p><strong>Bậc đào tạo:</strong> Đại học</p>
                    <p><strong>Cơ sở:</strong> CNTP TP.HCM</p>
                    <p><strong>Khoa:</strong> Khoa Công nghệ Thông tin</p>
                    <p><strong>Loại hình đào tạo:</strong> Chính quy</p>
                    <p><strong>Chuyên ngành:</strong> Công nghệ phần mềm</p>
                    <p><strong>Ngành:</strong> Công nghệ thông tin</p>
                    <p><strong>Khóa học:</strong> 2021</p>
                </div>
            </div>
        </div>
    );
};

export default StudentInfo;

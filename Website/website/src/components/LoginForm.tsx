export const LoginForm = () => {
    return (
      <div className="bg-white shadow-md p-6 rounded-lg w-80">
        <h2 className="text-lg font-semibold text-blue-800 mb-4 text-center">
          CỔNG THÔNG TIN SINH VIÊN
        </h2>
        <h3 className="text-md font-semibold text-blue-800 mb-6 text-center">
          ĐĂNG NHẬP HỆ THỐNG
        </h3>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nhập mã sinh viên"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="graduate" className="mr-2" />
            <label htmlFor="graduate" className="text-sm">Đã tốt nghiệp</label>
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nhập mã"
              className="flex-1 p-2 border rounded"
            />
            <button className="p-2 border rounded bg-gray-200">🔄</button>
            <img src="/path/to/captcha-image.png" alt="captcha" className="w-20 h-10"/>
          </div>
          <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
            ĐĂNG NHẬP
          </button>
          <div className="text-center mt-4">
            <a href="#" className="text-blue-500 underline hover:text-blue-700">Dành cho phụ huynh</a>
          </div>
        </form>
      </div>
    );
  };
  
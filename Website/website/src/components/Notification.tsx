export const Notification = () => {
    const notifications = [
      { date: "17 Tháng 10", content: "Thông báo công bố và cập nhật điểm Công tác xã hội..." },
      { date: "16 Tháng 10", content: "Thông báo về việc trả lại tiền cho sinh viên..." },
      { date: "15 Tháng 10", content: "Thông báo số 1012/TB-DCT về việc tổ chức thi..." },
      { date: "14 Tháng 10", content: "Thông báo về kết quả xét miễn giảm..." },
      { date: "12 Tháng 10", content: "Thông báo chiêu sinh các lớp ôn thi..." },
    ];
  
    return (
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">THÔNG BÁO CHUNG</h2>
        <ul>
          {notifications.map((notif, index) => (
            <li key={index} className="mb-2 border-b pb-2">
              <span className="block text-blue-500 font-bold">{notif.date}</span>
              <p className="text-gray-800">{notif.content}</p>
              <a href="#" className="text-red-500">Xem chi tiết</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
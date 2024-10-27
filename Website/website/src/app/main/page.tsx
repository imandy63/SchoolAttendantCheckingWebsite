// page.tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheckCircle, faShareAlt, faCopy, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import MainHeader from "@/components/MainHeader";

// Dữ liệu mẫu cho sự kiện
const events = [
  {
    date: "2024-09-21",
    title: "Hội thảo du học và học bổng Hàn Quốc",
    time: "9:00 AM",
    location: "Hội trường C",
    description: "Du học, hội thảo",
    attendees: 104,
    registered: false,
  },
  {
    date: "2024-09-21",
    title: "Seminar học thuật",
    time: "3:00 PM",
    location: "Hội trường C",
    description: "Du học, hội thảo",
    attendees: 104,
    registered: true,
  },
  {
    date: "2024-10-05",
    title: "Hội thảo du học và học bổng Hàn Quốc",
    time: "9:00 AM",
    location: "Hội trường C",
    description: "Du học, hội thảo",
    attendees: 104,
    registered: false,
  },
];

// Hàm tạo các ngày trong tháng, bao gồm cả ô trống đầu tháng
const getDaysInMonth = (month: number, year: number): (Date | null)[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Xác định số ô trống đầu tháng bằng cách sử dụng Array.fill
  const emptyDays: (Date | null)[] = new Array(firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1).fill(null);

  // Tạo các ngày trong tháng
  const days: (Date | null)[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  // Kết hợp các ô trống và ngày tháng
  return [...emptyDays, ...days];
};

export default function HomePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(month, year);

  // Hàm chuyển đổi tháng
  const changeMonth = (direction: "prev" | "next") => {
    setMonth((prevMonth) => {
      let newMonth = direction === "prev" ? prevMonth - 1 : prevMonth + 1;
      if (newMonth < 0) {
        setYear((prevYear) => prevYear - 1);
        newMonth = 11;
      } else if (newMonth > 11) {
        setYear((prevYear) => prevYear + 1);
        newMonth = 0;
      }
      return newMonth;
    });
  };

  // Hàm để định dạng ngày theo "YYYY-MM-DD" mà không bị ảnh hưởng bởi UTC
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Lọc sự kiện theo ngày đã chọn
  const filteredEvents = events.filter(
    (event) => {
      if (selectedDate != null) {
        console.log(event.date, formatDate(selectedDate));
      }
      return selectedDate && event.date === formatDate(selectedDate)
    }
  );

  return (
    <div className="web-container">
      <MainHeader />
      <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row p-6 w-full max-w-5xl">
          {/* Calendar Section */}
          <div className="w-full lg:w-1/3 p-4 border-r border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => changeMonth("prev")}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <h2 className="text-center font-semibold text-xl">{`${month + 1}/${year}`}</h2>
              <button onClick={() => changeMonth("next")}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <div key={day} className="text-gray-500 font-semibold">
                  {day}
                </div>
              ))}
              {daysInMonth.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  className={`${date &&
                    selectedDate?.getTime() === date.getTime()
                    ? "bg-green-200 text-green-800"
                    : ""
                    } rounded-full p-2 hover:bg-gray-200 ${date ? '' : 'invisible'}`}
                >
                  {date ? date.getDate() : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="w-full lg:w-2/3 p-4">
            <h2 className="text-2xl font-semibold mb-6">Hoạt động sắp tới</h2>

            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div key={index} className="border-b border-gray-300 pb-6 mb-6">
                  <p className="font-semibold text-lg mb-2">
                    {selectedDate?.toLocaleDateString("vi-VN")}
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="/path/to/event-image.jpg" alt="Event" className="w-20 h-20 rounded" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-gray-500">
                        {event.time} - {event.description}, {event.location}
                      </p>
                      <p className="text-gray-500">{event.attendees} sinh viên đã tham gia</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {event.registered ? (
                        <span className="text-green-600">
                          <FontAwesomeIcon icon={faCheckCircle} /> Đã đăng ký
                        </span>
                      ) : (
                        <>
                          <button className="text-gray-500 hover:text-gray-700">
                            <FontAwesomeIcon icon={faShareAlt} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có sự kiện nào cho ngày đã chọn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
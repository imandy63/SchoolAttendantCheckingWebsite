"use client";

import { useEffect, useRef, useState } from "react";
import MainHeader from "@/components/MainHeader";
import {
  useGetActivitiesByDate,
  useGetUpcomingActivitiesGroupByDate,
} from "@/query/useActivity";
import CalendarComponent from "../_components/calendar";
import UpcomingActivities from "../_components/UpcomingActivities";
import EventDetails from "../_components/ActivitiesByDate";

// Hàm tạo các ngày trong tháng
const getDaysInMonth = (month: number, year: number): (Date | null)[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptyDays: (Date | null)[] = new Array(
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
  ).fill(null);

  const days: (Date | null)[] = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(year, month, i + 1)
  );

  return [...emptyDays, ...days];
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is from 0-11
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
};

export default function HomePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const upcomingActivities = useGetUpcomingActivitiesGroupByDate();
  const activitiesByDate = useGetActivitiesByDate(
    selectedDate ? formatDate(selectedDate) : ""
  );

  const daysInMonth = getDaysInMonth(month, year);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll setup
  useEffect(() => {
    if (!loadMoreRef.current || upcomingActivities.isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !selectedDate) {
        upcomingActivities.fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [upcomingActivities, selectedDate]);

  const changeMonth = (direction: "prev" | "next") => {
    setMonth((prevMonth) => {
      let newMonth = direction === "prev" ? prevMonth - 1 : prevMonth + 1;
      let newYear = year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      setYear(newYear);
      return newMonth;
    });
  };

  return (
    <div className="web-container">
      <MainHeader />
      <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row p-6 w-full max-w-5xl">
          {/* CalendarComponent Section */}
          <CalendarComponent
            month={month}
            year={year}
            daysInMonth={daysInMonth}
            setSelectedDate={setSelectedDate}
            changeMonth={changeMonth}
            selectedDate={selectedDate}
          />

          {/* Upcoming Events && Event By Date Section */}
          {selectedDate ? (
            <EventDetails
              selectedDate={selectedDate}
              activitiesByDate={activitiesByDate}
            />
          ) : (
            <UpcomingActivities
              upcomingActivities={upcomingActivities}
              loadMoreRef={loadMoreRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}

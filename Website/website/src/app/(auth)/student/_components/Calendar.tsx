import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface CalendarProps {
  month: number;
  year: number;
  daysInMonth: (Date | null)[];
  setSelectedDate: (date: Date | null) => void;
  changeMonth: (direction: "prev" | "next") => void;
  selectedDate: Date | null;
}

const CalendarComponent: React.FC<CalendarProps> = ({
  month,
  year,
  daysInMonth,
  setSelectedDate,
  changeMonth,
  selectedDate,
}) => {
  return (
    <div className="w-full lg:w-1/3 p-4 border-r border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth("prev")}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="text-center font-semibold text-xl">{`${
          month + 1
        }/${year}`}</h2>
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
            onClick={() => {
              if (date) {
                setSelectedDate(
                  selectedDate && date.getTime() === selectedDate.getTime()
                    ? null
                    : date
                );
              }
            }}
            className={`${
              date && selectedDate?.getTime() === date.getTime()
                ? "bg-green-200 text-green-800"
                : ""
            } rounded-full p-2 hover:bg-gray-200 ${date ? "" : "invisible"}`}
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarComponent;

"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { events, events as mockEvents } from "../../../mock-data";
import Image from "next/image";
import clsx from "clsx";
import styles from "../../../../components_style/SearchPage.module.css";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase();

  // State for filtered events and filters
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [selectedType, setSelectedType] = useState(""); // State for selected type (e.g., 'Du học', 'Hội thảo')
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location

  // Lấy danh sách các giá trị duy nhất từ dữ liệu
  const uniqueDates = events
    .map((event) => event.date)
    .filter((date, index, self) => self.indexOf(date) === index);

  const uniqueTypes = events
    .map((event) => event.format)
    .filter((format, index, self) => self.indexOf(format) === index);

  const uniqueLocations = events
    .map((event) => event.location)
    .filter((location, index, self) => self.indexOf(location) === index);

  // Lọc sự kiện dựa vào các bộ lọc
  const filteredEvents = events.filter((event) => {
    return (
      (selectedDate === "" || event.date === selectedDate) &&
      (selectedType === "" || event.format === selectedType) &&
      (selectedLocation === "" || event.location === selectedLocation)
    );
  });

  // Handle filtering by query, date, type, and location
  useEffect(() => {
    let events = mockEvents;

    // Filter by query (search term)
    if (query) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Filter by date
    if (selectedDate) {
      events = events.filter((event) => event.date === selectedDate);
    }

    // Filter by type (Du học, Hội thảo, etc.)
    if (selectedType) {
      events = events.filter((event) =>
        event.description.includes(selectedType)
      );
    }

    // Filter by location
    if (selectedLocation) {
      events = events.filter((event) => event.location === selectedLocation);
    }
  }, [query, selectedDate, selectedType, selectedLocation]); // Re-run when query or filters change

  return (
    <>
      <h1 className={styles.searchTitle}>Kết quả tìm kiếm: {query}</h1>

      {/* Event Filter Section */}
      <div className={styles.filterContainer}>
        {/* Filter by date */}
        <div className={styles.filterItem}>
          <label>Ngày</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">Tất cả</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("vi-VN")}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by type */}
        <div className={styles.filterItem}>
          <label>Hình thức</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Tất cả</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by location */}
        <div className={styles.filterItem}>
          <label>Loại</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Tất cả</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Filtered Events */}
      <div className={styles.eventsContainer}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className={styles.eventCard}>
              <Image
                src="/event-image.png" // Placeholder image
                alt={event.title}
                width={100}
                height={100}
                className={styles.eventImage}
              />
              <div className={styles.eventInfo}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p>
                  <strong>Ngày:</strong> {event.date}
                </p>
                <p>
                  <strong>Giờ:</strong> {event.time}
                </p>
                <p>
                  <strong>Địa điểm:</strong> {event.location}
                </p>
                <p>
                  <strong>Tham gia:</strong> {event.attendees}
                </p>
              </div>
              <div className={styles.eventActions}>
                {event.registered ? (
                  <button className={clsx(styles.btn, styles.btnRegistered)}>
                    Đã đăng ký
                  </button>
                ) : (
                  <button className={clsx(styles.btn, styles.btnRegister)}>
                    Đăng ký
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy kết quả nào.</p>
        )}
      </div>
    </>
  );
};

export default Search;

"use client";

import { useState } from "react";
import { Button } from "../../components/Button";

type EditActivityFormProps = {
  initialData: {
    name: string;
    start_date: string;
    max_participants: number;
    point: number;
    duration: number;
    thumb_url: string;
    host: string;
    categories: string;
    status: string;
  };
  onSave: (updatedActivity: any) => void;
};

export const EditActivityForm = ({ initialData, onSave }: EditActivityFormProps) => {
  const [activity, setActivity] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(activity);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={activity.name}
          onChange={handleChange}
          placeholder="Tên hoạt động"
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="start_date"
          value={activity.start_date}
          onChange={handleChange}
          placeholder="Ngày bắt đầu"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="max_participants"
          value={activity.max_participants}
          onChange={handleChange}
          placeholder="Số lượng người tham gia tối đa"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="point"
          value={activity.point}
          onChange={handleChange}
          placeholder="Điểm rèn luyện"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="duration"
          value={activity.duration}
          onChange={handleChange}
          placeholder="Thời lượng (giờ)"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="thumb_url"
          value={activity.thumb_url}
          onChange={handleChange}
          placeholder="URL ảnh đại diện"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="host"
          value={activity.host}
          onChange={handleChange}
          placeholder="Đơn vị tổ chức"
          className="p-2 border rounded"
        />
        <select
          name="categories"
          value={activity.categories}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Hội thảo">Hội thảo</option>
          <option value="Việc làm">Việc làm</option>
          <option value="Lễ hội">Lễ hội</option>
        </select>
        <select
          name="status"
          value={activity.status}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="OPEN">OPEN</option>
          <option value="FULL">FULL</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>
      <div className="mt-4">
        <Button label="Lưu thay đổi" onClick={handleSave} variant="primary" />
      </div>
    </div>
  );
};

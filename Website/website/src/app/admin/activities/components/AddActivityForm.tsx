import { useState } from "react";
import { Button } from "../../components/Button";

type AddActivityFormProps = {
  onSubmit: (activityData: any) => void;
};

export const AddActivityForm = ({ onSubmit }: AddActivityFormProps) => {
  const [activityName, setActivityName] = useState("");
  const [activityStartDate, setActivityStartDate] = useState("");
  const [activityMaxParticipants, setActivityMaxParticipants] = useState(0);
  const [activityPoint, setActivityPoint] = useState(0);
  const [activityDuration, setActivityDuration] = useState(0);
  const [activityHost, setActivityHost] = useState("");
  const [activityCategories, setActivityCategories] = useState("Hội thảo");
  const [thumbFile, setThumbFile] = useState<File | null>(null); // Biến mới để lưu file ảnh

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    if (thumbFile) {
      formData.append("thumb_file", thumbFile);
    }
    formData.append("activity_name", activityName);
    formData.append("activity_start_date", activityStartDate);
    formData.append("activity_max_participants", activityMaxParticipants.toString());
    formData.append("activity_point", activityPoint.toString());
    formData.append("activity_duration", activityDuration.toString());
    formData.append("activity_host", activityHost);
    formData.append("activity_categories", activityCategories);

    onSubmit(formData);
  };

  return (
    <form className="space-y-4 text-black  " onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block mb-2">Tên hoạt động</label>
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Ngày bắt đầu</label>
        <input
          type="date"
          value={activityStartDate}
          onChange={(e) => setActivityStartDate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Tải lên hình ảnh</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbUpload}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Số lượng tối đa</label>
        <input
          type="number"
          value={activityMaxParticipants}
          onChange={(e) => setActivityMaxParticipants(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Điểm</label>
        <input
          type="number"
          value={activityPoint}
          onChange={(e) => setActivityPoint(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Thời gian hoạt động (giờ)</label>
        <input
          type="number"
          value={activityDuration}
          onChange={(e) => setActivityDuration(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Danh mục</label>
        <select
          value={activityCategories}
          onChange={(e) => setActivityCategories(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="Hội thảo">Hội thảo</option>
          <option value="Việc làm">Việc làm</option>
          <option value="Lễ hội">Lễ hội</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Người tổ chức</label>
        <input
          type="text"
          value={activityHost}
          onChange={(e) => setActivityHost(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <Button label="Thêm hoạt động" onClick={handleSubmit} variant="primary" />
    </form>
  );
};

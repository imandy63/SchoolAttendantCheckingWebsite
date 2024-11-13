import Image from "next/image";
import { useRouter } from "next/navigation";

const ActivityCard = ({
  activity_id,
  activity_name,
  activity_start_date,
  activity_categories,
  activity_host,
  activity_max_participants,
  activity_total_participants,
  participation_status,
  activity_thumb_url,
  activity_location,
}: {
  activity_id: string;
  activity_name: string;
  activity_categories: string[];
  activity_thumb_url: string;
  activity_start_date: string;
  activity_max_participants: number;
  activity_total_participants: number;
  activity_host: string;
  participation_status: boolean;
  activity_location: string;
}) => {
  const formattedStartDate = new Date(activity_start_date).toLocaleString(
    "en-US",
    {
      dateStyle: "full",
      timeStyle: "short",
    }
  );

  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Image
          src={activity_thumb_url || "/placeholder.jpg"}
          alt={activity_name}
          width={100}
          height={100}
          className="rounded-lg mr-4"
        />
        <div>
          <h3
            className="text-xl font-bold cursor-pointer hover:text-gray-400 duration-200"
            onClick={() => {
              router.push(`/activity/${activity_id}`);
            }}
          >
            {activity_name}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{formattedStartDate}</p>
          <p className="text-gray-500 text-sm">
            Host: {activity_host} | Categories: {activity_categories.join(", ")}
          </p>
          <p className="text-gray-500 text-sm">Địa điểm: {activity_location}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="text-gray-500 text-sm">
            {activity_total_participants}/{activity_max_participants}
          </p>
          <p className="text-gray-500 text-sm ml-2">Participants</p>
        </div>
        {participation_status ? (
          <div className="flex items-center text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2">Đã đăng ký</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;

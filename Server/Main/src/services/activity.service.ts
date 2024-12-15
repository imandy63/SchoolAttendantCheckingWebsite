import { ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { redisInstance } from "../dbs/redis.init";
import { Activity_status } from "../enum/activity.enum";
import { Notification_type } from "../enum/notificationType.enum";
import {
  activities,
  IActivity,
  IActivityParticipant,
} from "../models/activity.model";
import {
  findStudentById,
  participateInActivity,
} from "../models/repositories/student.repo";
import { students } from "../models/student.model";
import { convertToObjectIdMongoose } from "../utils";
import { NotificationService } from "./notification.service";
import { RedisService } from "./redis.service";
import { Participation_Status, Role } from "../enum/role.enum";
import { ActivityTracking_status } from "../enum/activityTracking.enum";
import ExcelJS from "exceljs";
import { all } from "axios";

class ActivityService {
  static redisService = RedisService.getInstance();
  static redis = redisInstance.getRedis();
  static async getActivities({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page: number;
    limit: number;
    search: string;
  }) {
    const result = await activities.aggregate([
      { $match: { activity_name: { $regex: search, $options: "i" } } },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          activity_participants_total: { $size: "$activity_participants" },
        },
      },
      {
        $project: {
          activity_participants_total: 1,
          activity_name: 1,
          activity_start_date: 1,
          activity_max_participants: 1,
          activity_point: 1,
          activity_thumb_url: 1,
          activity_duration: 1,
          activity_categories: 1,
          activity_status: 1,
          activity_host: 1,
        },
      },
    ]);
    const total = await activities.countDocuments({
      activity_name: { $regex: search, $options: "i" },
    });
    return { data: result, total, page, limit };
  }

  static async getYearStatistics(year: number) {
    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $lookup: {
          from: "ActivityTrackings",
          localField: "_id",
          foreignField: "activity_id",
          as: "tracking_data",
        },
      },
      {
        $addFields: {
          participated_students: {
            $size: {
              $filter: {
                input: "$tracking_data",
                as: "tracking",
                cond: {
                  $eq: [
                    "$$tracking.status",
                    ActivityTracking_status.PARTICIPATED,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$activity_start_date" } }, // Group by month
          total_participants: { $sum: "$participated_students" }, // Sum participated students
          total_students: { $sum: "$activity_total_participants" }, // Sum total students
        },
      },
      {
        $project: {
          month: "$_id.month", // Extract month from _id
          total_participants: 1,
          total_students: 1,
          _id: 0, // Exclude _id from the result
        },
      },
      {
        $sort: { month: 1 }, // Sort results by month
      },
    ]);

    return result;
  }

  static async getTimeRange() {
    const result = await activities.aggregate([
      {
        $group: {
          _id: null,
          min: { $min: "$activity_start_date" },
          max: { $max: "$activity_start_date" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return result[0];
  }

  static async getStatistics({ year, month }: { year: number; month: number }) {
    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: {
            $gte: new Date(`${year}-${month}-01`),
            $lt: new Date(
              `${month == 12 ? year + 1 : year}-${
                month == 12 ? 1 : month + 1
              }-01`
            ),
          },
        },
      },
      {
        $lookup: {
          from: "ActivityTrackings",
          localField: "_id",
          foreignField: "activity_id",
          as: "participants",
        },
      },
      {
        $addFields: {
          number_of_students: "$activity_total_participants",
          number_of_participated_students: {
            $size: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: {
                  $eq: [
                    "$$participant.status",
                    ActivityTracking_status.PARTICIPATED,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          activities: { $push: "$$ROOT" },
          number_of_activities: { $sum: 1 },
          total_students_by_activities: { $sum: "$number_of_students" },
          total_participated_students: {
            $sum: "$number_of_participated_students",
          },
        },
      },
      {
        $project: {
          _id: 0,
          number_of_activities: 1,
          total_students_by_activities: 1,
          total_participated_students: 1,
          activities: {
            _id: 1,
            activity_name: 1,
            number_of_students: 1,
            number_of_participated_students: 1,
          },
        },
      },
    ]);
    return result[0];
  }

  static async getPastCheckings({ id }: { id: string }) {
    const foundStudent = await students.find({
      _id: convertToObjectIdMongoose(id),
      role: Role.UNION_WORKER,
      is_active: true,
    });
    if (!foundStudent) throw new NotFoundError("Union worker not found");

    return await activities.find({
      activity_start_date: { $lt: new Date() },
      assigned_to: convertToObjectIdMongoose(id),
    });
  }

  static async getActivitiesByDate({
    date,
    userId,
  }: {
    date: string;
    userId: string;
  }) {
    let parsedDate: Date;

    if (typeof date === "string") {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;

      if (!dateRegex.test(date)) {
        throw new BadRequestError(
          "Invalid date format. Please use dd-mm-yyyy."
        );
      }

      const [day, month, year] = date.split("-").map(Number);
      parsedDate = new Date(year, month - 1, day);
    } else {
      throw new BadRequestError(
        "Invalid date input. Must be a string or Date."
      );
    }

    const foundStudent = await students.findById(userId);
    if (!foundStudent) throw new NotFoundError("Student not found");

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);
    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $addFields: {
          participation_status: {
            $cond: {
              if: { $in: [foundStudent?.student_id, "$activity_participants"] },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
    return result;
  }

  static async getActivityCategories() {
    return await activities.find({}).distinct("activity_categories");
  }

  static async userGetActivity({
    activity_id,
    userId,
  }: {
    activity_id: string;
    userId: string;
  }) {
    const foundStudent = await students.findById(userId).lean();
    if (!foundStudent) throw new NotFoundError("Student not found");
    const foundActivity = await activities.aggregate([
      { $match: { _id: convertToObjectIdMongoose(activity_id) } },
      {
        $addFields: {
          participatable: {
            $not: {
              $in: [
                foundStudent.student_id,
                {
                  $map: {
                    input: "$activity_participants",
                    as: "participant",
                    in: "$$participant.student_id",
                  },
                },
              ],
            },
          },
        },
      },
    ]);
    if (foundActivity.length > 0) {
      return foundActivity[0];
    }
    throw new NotFoundError("Activity not found");
  }

  static async getParticipatableActivity({
    activity_id,
  }: {
    activity_id: string;
  }) {
    const foundActivity = await activities.findOne({
      _id: convertToObjectIdMongoose(activity_id),
      activity_status: Activity_status.OPEN,
    });
    return foundActivity;
  }

  static async getUpcomingActivitiesGroupByDate({
    page = 1,
    limit = 10,
    search = "",
    userId,
  }: {
    page: number;
    limit: number;
    search: string;
    userId: string;
  }) {
    const foundStudent = await findStudentById(userId);

    const result = await activities.aggregate([
      {
        $match: {
          activity_start_date: { $gte: new Date() },
          activity_name: { $regex: search, $options: "i" },
        },
      },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $addFields: {
          participation_status: {
            $cond: {
              if: { $in: [foundStudent?.student_id, "$activity_participants"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$activity_start_date",
            },
          },
          activities: { $push: "$$ROOT" },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $sort: { "activities.activity_start_date": -1 },
      },
    ]);
    return result;
  }

  static async getActivityParticipants({
    activity_id,
  }: {
    activity_id: string;
  }) {
    return activities.findOne(
      { _id: convertToObjectIdMongoose(activity_id) },
      { activity_participants: 1 }
    );
  }

  static async getActivity({ activity_id }: { activity_id: string }) {
    return await activities
      .findOne({ _id: convertToObjectIdMongoose(activity_id) })
      .lean();
  }

  static async createActivity({
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_duration,
    activity_thumb_url,
    created_by,
    activity_categories,
    activity_location,
    activity_host,
  }: IActivity) {
    const foundActivity = await activities
      .findOne({ activity_name: activity_name })
      .lean();

    if (foundActivity) {
      throw new BadRequestError("Activity name already exists");
    }

    const result = await activities.create({
      activity_name,
      activity_start_date,
      activity_max_participants,
      activity_point,
      activity_duration,
      activity_thumb_url,
      created_by,
      activity_location,
      activity_categories,
      activity_host,
    });

    const users = await students.aggregate([
      {
        $match: {
          subscribed_categories: { $in: activity_categories },
        },
      },
      {
        $group: {
          _id: 1,
          userIds: { $addToSet: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    if (users.length === 0 || users[0].userIds.length === 0) return result;

    const userIds = users[0].userIds.map((oid: ObjectId) => oid.toString());

    if (users.length > 0) {
      await NotificationService.sendNotification({
        userIds: userIds,
        title: `Hoạt động mới: ${activity_name}`,
        message: `Có hoạt động mới trùng với danh mục bạn đăng ký`,
        type: Notification_type.ANNOUNCEMENT,
      });
    }

    return result;
  }

  static async updateActivity({
    activity_id,
    activity_name,
    activity_start_date,
    activity_max_participants,
    activity_point,
    activity_thumb_url,
    activity_location,
    activity_duration,
    activity_categories,
    activity_host,
  }: IActivity & { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(activity_id) },
      {
        activity_name,
        activity_start_date,
        activity_max_participants,
        activity_point,
        activity_location,
        activity_thumb_url,
        activity_duration,
        activity_categories,
        activity_host,
      }
    );
  }

  static async removeActivity({ activity_id }: { activity_id: string }) {
    return await activities.findOneAndUpdate(
      { activity_id },
      { activity_status: Activity_status.REMOVED }
    );
  }

  static async participateInActivity({
    activity_id,
    userId,
  }: {
    activity_id: string;
    userId: string;
  }) {
    const foundStudent = await findStudentById(userId);
    if (!foundStudent) {
      throw new NotFoundError("Student not found");
    }
    const foundActivity = await ActivityService.getParticipatableActivity({
      activity_id,
    });

    if (!foundActivity) {
      throw new NotFoundError("Activity not found");
    }

    const participated = await this.redisService.acquireLock({
      id: activity_id,
      callback: async () => {
        return await activities.updateOne(
          { _id: convertToObjectIdMongoose(activity_id) },
          {
            $inc: { activity_total_participants: 1 },
            $push: {
              activity_participants: {
                student_id: foundStudent.student_id,
                student_name: foundStudent.student_name,
              },
            },
            $set: {
              status: {
                $cond: {
                  if: {
                    $eq: [
                      "$activity_total_participants",
                      "$activity_max_participants",
                    ],
                  },
                  then: Activity_status.FULL,
                  else: "$status",
                },
              },
            },
          }
        );
      },
    });

    if (!participated || participated == 0) {
      throw new BadRequestError("Failed to participate in activity");
    }

    return {
      activity_id,
      student: await participateInActivity({
        activity_id: foundActivity._id.toString(),
        student_id: foundStudent.student_id,
        activity_name: foundActivity.activity_name,
      }),
    };
  }

  static async leaveActivity({
    activity_id,
    id,
  }: {
    activity_id: string;
    id: string;
  }) {
    const foundStudent = await students
      .findOne({ _id: convertToObjectIdMongoose(id) })
      .lean();
    if (!foundStudent) {
      throw new NotFoundError("Student not found");
    }

    const result = await activities.findOneAndUpdate(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: { $in: [Activity_status.OPEN, Activity_status.FULL] },
      },
      {
        $pull: {
          activity_participants: { student_id: foundStudent.student_id },
        },
        $inc: { activity_total_participants: -1 },
      },
      { new: true }
    );

    await students.findOneAndUpdate(
      { _id: foundStudent._id },
      {
        $pull: {
          student_participated_activities: {
            _id: convertToObjectIdMongoose(activity_id),
          },
        },
      }
    );

    if (
      result &&
      result.activity_total_participants <= result.activity_max_participants
    ) {
      return await activities.findOneAndUpdate(
        { _id: convertToObjectIdMongoose(activity_id) },
        { activity_status: Activity_status.OPEN },
        { new: true }
      );
    }
    return result;
  }

  static async closeActivity({ activity_id }: { activity_id: string }) {
    return await activities.findOneAndUpdate(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: { $ne: Activity_status.CLOSED },
      },
      { activity_status: Activity_status.CLOSED }
    );
  }

  static async assignAttendantChecking({
    activity_id,
    student_id,
  }: {
    activity_id: string;
    student_id: string;
  }) {
    const foundWorker = await students
      .findOne({
        _id: convertToObjectIdMongoose(student_id),
        role: Role.UNION_WORKER,
        is_active: true,
      })
      .lean();

    if (!foundWorker) {
      throw new NotFoundError("Worker not found");
    }
    return await activities.findOneAndUpdate(
      { _id: convertToObjectIdMongoose(activity_id) },
      { assigned_to: convertToObjectIdMongoose(student_id) },
      {
        new: true,
      }
    );
  }

  static async removeCheckingAssignment({
    student_id,
    activity_id,
  }: {
    student_id: string;
    activity_id: string;
  }) {
    const foundWorker = await students
      .findOne({
        _id: convertToObjectIdMongoose(student_id),
        role: Role.UNION_WORKER,
      })
      .lean();

    if (!foundWorker) {
      throw new NotFoundError("Worker not found");
    }
    return await activities.findOneAndUpdate(
      {
        assigned_to: convertToObjectIdMongoose(student_id),
        _id: convertToObjectIdMongoose(activity_id),
      },
      { assigned_to: null },
      {
        new: true,
      }
    );
  }

  static async getAssignedActivitiesByWorker({ id }: { id?: string }) {
    if (!id) {
      throw new BadRequestError("Id not found");
    }
    const foundWorker = await students
      .findOne({
        _id: convertToObjectIdMongoose(id),
        role: Role.UNION_WORKER,
      })
      .lean();

    if (!foundWorker) {
      throw new NotFoundError("Worker not found");
    }

    return await activities.aggregate([
      {
        $match: {
          assigned_to: convertToObjectIdMongoose(id),
          activity_status: { $ne: Activity_status.REMOVED },
        },
      },
      {
        $sort: { activity_start_date: -1 },
      },
      {
        $addFields: {
          removable: {
            $cond: {
              if: { $gte: ["$activity_start_date", new Date()] },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);
  }

  static async getAssignableActivities({ id }: { id?: string }) {
    if (!id) {
      throw new BadRequestError("Id not found");
    }
    const foundWorker = await students
      .findOne({
        _id: convertToObjectIdMongoose(id),
        role: Role.UNION_WORKER,
      })
      .lean();

    if (!foundWorker) {
      throw new NotFoundError("Worker not found");
    }

    return await activities
      .find({
        activity_status: {
          $not: { $in: [Activity_status.REMOVED, Activity_status.CLOSED] },
        },
        assigned_to: null,
        activity_start_date: { $gte: new Date().toUTCString() },
      })
      .lean();
  }

  static async getAvailableAttendantChecking({ id }: { id: string }) {
    const foundWorker = await students.findOne({
      _id: convertToObjectIdMongoose(id),
      role: Role.UNION_WORKER,
    });

    if (!foundWorker) {
      throw new NotFoundError("Worker not found");
    }

    const sixHoursEarlier = new Date();
    sixHoursEarlier.setHours(sixHoursEarlier.getHours() - 6);

    return await activities
      .find({
        assigned_to: convertToObjectIdMongoose(id),
        activity_start_date: { $gte: sixHoursEarlier.toUTCString() },
      })
      .lean();
  }

  static async exportExcel() {
    try {
      const allActivities = await activities.find();
      const allStudents = await students.find({ role: { $ne: Role.ADMIN } });

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Activities");

      const font = { bold: true, size: 11, name: "Cambria" };
      const lastColumn = String.fromCharCode(65 + allActivities.length + 5);

      // Add merged title rows
      worksheet.mergeCells(`A1:C1`);
      worksheet.mergeCells(`A2:C2`);
      worksheet.mergeCells(`A3:C3`);
      worksheet.getCell("A1").value = "TRƯỜNG ĐẠI HỌC";
      worksheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("A1").font = font;

      worksheet.getCell("A2").value = "CÔNG THƯƠNG THÀNH PHỐ TP. HỒ CHÍ MINH";
      worksheet.getCell("A2").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("A2").font = font;

      worksheet.getCell("A3").value = "KHOA CÔNG NGHỆ THÔNG TIN";
      worksheet.getCell("A3").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("A3").font = font;

      worksheet.mergeCells(`E1:${lastColumn}1`);
      worksheet.getCell("E1").value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
      worksheet.getCell("E1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("E1").font = font;

      worksheet.mergeCells(`E2:${lastColumn}2`);
      worksheet.getCell("E2").value = "Độc lập - Tự do - Hạnh Phúc";
      worksheet.getCell("E2").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("E2").font = font;

      worksheet.mergeCells(`A5:${lastColumn}5`);
      worksheet.getCell("A5").value = "DANH SÁCH CHẤM ĐIỂM";
      worksheet.getCell("A5").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("A5").font = font;

      worksheet.mergeCells(`A6:${lastColumn}6`);
      worksheet.getCell("A6").value = allActivities
        .map((activity) => activity.activity_name)
        .join(", ");
      worksheet.getCell("A6").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell("A6").font = font;

      worksheet.addRow([]);

      const headers = [
        "STT",
        "MSSV",
        "Họ và tên",
        "Lớp",
        ...allActivities.map((activity, index) => `HD${index + 1}`),
        "Tổng điểm",
        "Ghi chú",
      ];

      const headerRows = worksheet.addRow(headers);

      headerRows.eachCell((cell, colNumber) => {
        // Add border to the cell
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Set alignment to center
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        // Set font style
        cell.font = { bold: true };
      });

      allStudents.forEach((student, index) => {
        const activityPoints = allActivities.map((activity) => {
          const participation = student.student_participated_activities.find(
            (participation) =>
              participation._id.toString() === activity._id.toString()
          );
          return participation?.point || 0;
        });

        const totalPoints = activityPoints.reduce(
          (sum, point) => sum + point,
          0
        );

        const dataRow = [
          index + 1,
          student.student_id,
          student.student_name,
          student.student_class?.class_name,
          ...activityPoints,
          totalPoints,
          "",
        ];

        const row = worksheet.addRow(dataRow);

        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          if (colNumber === headers.length) {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        });
      });

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      const numberOfColumns = allActivities.length + 5;

      const maxRow = allStudents.length + 10;

      if (numberOfColumns / 4 >= 3) {
        worksheet.mergeCells(`A${maxRow}:C${maxRow}`);
        worksheet.getCell(`A${maxRow}`).value = "Trưởng Đơn Vị";
        worksheet.getCell(`A${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${maxRow}`).font = font;

        const c2 = String.fromCharCode(65 + numberOfColumns / 2 - 1);
        const endC2 = String.fromCharCode(65 + numberOfColumns / 2 + 1);

        worksheet.mergeCells(`${c2}${maxRow}:${endC2}${maxRow}`);
        worksheet.getCell(`${c2}${maxRow}`).value = "Ban Tổ Chức";
        worksheet.getCell(`${c2}${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`${c2}${maxRow}`).font = font;

        const c3 = String.fromCharCode(65 + numberOfColumns - 2);

        worksheet.mergeCells(`${c3}${maxRow}:${lastColumn}${maxRow}`);
        worksheet.getCell(`${c3}${maxRow}`).value = "Người Tổng Hợp";
        worksheet.getCell(`${c3}${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`${c3}${maxRow}`).font = font;
      } else {
        worksheet.mergeCells(`A${maxRow}:C${maxRow}`);
        worksheet.getCell(`A${maxRow}`).value = "Trưởng Đơn Vị";
        worksheet.getCell(`A${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${maxRow}`).font = font;

        worksheet.mergeCells(`E${maxRow}:G${maxRow}`);
        worksheet.getCell(`E${maxRow}`).value = "Ban Tổ Chức";
        worksheet.getCell(`E${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`E${maxRow}`).font = font;

        worksheet.mergeCells(`I${maxRow}:K${maxRow}`);
        worksheet.getCell(`I${maxRow}`).value = "Người Tổng Hợp";
        worksheet.getCell(`I${maxRow}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`I${maxRow}`).font = font;
      }

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error("Error exporting activities:", error);
      throw new BadRequestError("Error exporting activities");
    }
  }
}

export { ActivityService };

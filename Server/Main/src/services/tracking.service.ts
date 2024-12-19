import { activityTrackings } from "../models/activityTracking.model";
import { activities, IActivityParticipant } from "../models/activity.model";
import { convertToObjectIdMongoose } from "../utils";
import { Activity_status } from "../enum/activity.enum";
import { startOfDay, endOfDay } from "date-fns";
import { students } from "../models/student.model";
import { ActivityTracking_status } from "../enum/activityTracking.enum";
import { ActivityService } from "./activity.service";
import { StudentService } from "./student.service";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { Notification_type } from "../enum/notificationType.enum";
import { NotificationService } from "./notification.service";
import PdfPrinter from "pdfmake";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";

export class ActivityTrackingService {
  static async getStudentActivityTracking({
    activity_id,
  }: {
    activity_id: string;
  }) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const existingTracking = await activityTrackings
      .find({ activity_id: convertToObjectIdMongoose(activity_id) })
      .lean();

    if (existingTracking.length > 0) {
      const studentIds = existingTracking.map((tracking) => tracking.user_id);

      const studentsData = await students
        .find(
          { _id: { $in: studentIds } },
          { student_id: 1, student_class: 1, student_name: 1 }
        )
        .lean();

      const trackingWithStudentData = existingTracking.map((tracking) => {
        const student = studentsData.find(
          (s) => s._id.toString() === tracking.user_id.toString()
        );
        return {
          ...tracking,
          student_id: student?.student_id,
          student_class: student?.student_class,
          student_name: student?.student_name,
        };
      });

      return trackingWithStudentData;
    }

    const foundActivity = await activities.findOne(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: {
          $not: {
            $in: [Activity_status.REMOVED, Activity_status.CLOSED],
          },
        },
        activity_start_date: {
          $gte: todayStart,
          $lt: todayEnd,
        },
      },
      { activity_participants: 1, _id: 0 }
    );

    if (
      foundActivity != null &&
      foundActivity.activity_participants.length > 0
    ) {
      const participantIds = foundActivity.activity_participants.map(
        (participant) => participant.student_id
      );

      const studentsData = await students
        .find(
          { student_id: { $in: participantIds } },
          { student_id: 1, student_class: 1, student_name: 1 }
        )
        .lean();

      const bashInsert = studentsData.map((student) => ({
        activity_id,
        user_id: student._id,
        student_id: student.student_id,
        student_class: student.student_class,
        status: ActivityTracking_status.PENDING,
        student_name: student.student_name,
        participation_date: new Date().toUTCString(),
      }));
      if (bashInsert.length > 0) {
        await activityTrackings.insertMany(bashInsert);
        return bashInsert;
      }
    }

    return null;
  }

  static async exportPdf({ id }: { id: string }, res: any) {
    try {
      // Fetch data for the PDF report
      const data = await this.getStudentActivityTracking({ activity_id: id });

      const foundActivity = await activities
        .findOne({ _id: convertToObjectIdMongoose(id) })
        .lean();

      if (!foundActivity) throw new NotFoundError("Activity not found");

      if (foundActivity.activity_start_date > new Date()) {
        throw new BadRequestError("Error");
      }

      if (!data || data.length === 0) return res.send("No data found");

      const processedData = data.map((item) => ({
        student_id: item.student_id,
        student_name: item.student_name,
        student_class: item.student_class?.class_name || "N/A",
        attendance: " ", // Placeholder for "Điểm danh" column
      }));
      // Create a new PDF document with A4 page size
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points (72 DPI)

      // Register the font and set it
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = fs.readFileSync("./src/fonts/Roboto-Regular.ttf");
      const font = await pdfDoc.embedFont(fontBytes);
      pdfDoc.setLanguage("vi");

      // Write the title
      page.drawText(`${foundActivity.activity_name as string}`, {
        x: 20,
        y: 800, // Adjusted for A4 size
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      // Define table headers
      const headers = ["MSSV", "Họ và tên", "Lớp", "Điểm danh"];
      const columnWidths = [100, 200, 150, 100]; // Adjust column widths
      let yPosition = 760; // Starting Y position for headers

      // Draw header row with borders
      headers.forEach((header, index) => {
        const xPosition =
          10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);

        // Draw header cell border
        page.drawRectangle({
          x: xPosition,
          y: yPosition - 20,
          width: columnWidths[index],
          height: 20,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
        });

        // Draw header text
        page.drawText(header, {
          x: xPosition + 10,
          y: yPosition - 15,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      });

      // Draw table rows with borders
      yPosition -= 20; // Adjust Y position for the first row
      processedData.forEach((row) => {
        const rowValues = [
          row.student_id,
          row.student_name,
          row.student_class,
          row.attendance,
        ];

        rowValues.forEach((value, index) => {
          const xPosition =
            10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);

          // Draw cell border
          page.drawRectangle({
            x: xPosition,
            y: yPosition - 20,
            width: columnWidths[index],
            height: 20,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });

          // Draw cell text
          page.drawText(value || "", {
            x: xPosition + 10,
            y: yPosition - 15,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
        });

        yPosition -= 20; // Move to the next row
      });

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Set response headers for PDF file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=StudentActivityTracking.pdf"
      );

      // Send the PDF file
      res.end(pdfBytes);
    } catch (error) {
      console.error("Error exporting PDF file:", error);
      res.status(500).send("Error exporting PDF.");
    }
  }

  static async getTracking({ activity_id }: { activity_id: string }) {
    const result = await activityTrackings.aggregate([
      {
        $match: {
          activity_id: convertToObjectIdMongoose(activity_id),
        },
      },
      {
        $lookup: {
          from: "Students",
          localField: "user_id",
          foreignField: "_id",
          as: "student_details",
        },
      },
      {
        $unwind: {
          path: "$student_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          student_id: "$student_details.student_id",
          student_name: "$student_details.student_name",
          activity_status: "$status",
          _id: 0,
        },
      },
    ]);
    return result;
  }

  static async updateTracking({
    student_ids,
    activity_id,
  }: {
    student_ids: string[];
    activity_id: string;
  }) {
    const foundActivity = await activities.findOne(
      {
        _id: convertToObjectIdMongoose(activity_id),
        activity_status: {
          $not: {
            $in: [Activity_status.REMOVED, Activity_status.CLOSED],
          },
        },
      },
      { activity_participants: 1, _id: 0, activity_name: 1, activity_point: 1 }
    );
    if (!foundActivity) {
      throw new NotFoundError("Activity not found");
    }
    const foundStudents = await students.aggregate([
      {
        $match: {
          student_id: { $in: student_ids },
        },
      },
      {
        $group: {
          _id: 1,
          ids: { $push: "$_id" },
        },
      },
      {
        $project: {
          ids: 1,
        },
      },
    ]);

    if (
      foundStudents.length > 0 &&
      student_ids.length !== foundStudents[0].ids.length
    ) {
      throw new NotFoundError("Students not found");
    }

    const absentStudents = await students.aggregate([
      {
        $match: {
          "student_participated_activities._id":
            convertToObjectIdMongoose(activity_id),
          student_id: { $nin: student_ids },
        },
      },
      {
        $group: {
          _id: 1,
          ids: { $push: "$_id" },
        },
      },
      {
        $project: {
          ids: 1,
        },
      },
    ]);

    if (absentStudents.length !== 0 && absentStudents[0].ids.length !== 0) {
      await NotificationService.sendNotification({
        userIds: absentStudents[0].ids,
        title: `Điểm danh vắng`,
        message: `Bạn đã không tham gia hoat động ${foundActivity.activity_name}`,
        type: Notification_type.WARNING,
      });
    }

    // update student participated activities

    if (student_ids.length === 0) {
      await activityTrackings.updateMany(
        {
          activity_id: convertToObjectIdMongoose(activity_id),
        },
        {
          $set: {
            status: ActivityTracking_status.ABSENT,
          },
        }
      );
    } else {
      await activityTrackings.updateMany(
        {
          activity_id: convertToObjectIdMongoose(activity_id),
          user_id: { $in: foundStudents[0].ids },
        },
        {
          $set: {
            status: ActivityTracking_status.PARTICIPATED,
          },
        }
      );
      await activityTrackings.updateMany(
        {
          activity_id: convertToObjectIdMongoose(activity_id),
          user_id: { $nin: foundStudents[0].ids },
        },
        {
          $set: {
            status: ActivityTracking_status.ABSENT,
          },
        }
      );
    }

    // update student point

    await StudentService.studentAddActivityPoint({
      student_ids,
      activity_id,
      point: foundActivity.activity_point,
    });
    await ActivityService.closeActivity({ activity_id });
    return { status: "success" };
  }
}

import { Schema } from 'mongoose';

export const FacultySchema = new Schema({
  bannerId: Number,
  category: String,
  class: String,
  courseReferenceNumber: Number,
  displayName: String,
  emailAddress: String,
  primaryIndicator: Boolean,
  term: Number
});

export const MeetingsFacultySchema = new Schema({
  category: String,
  class: String,
  courseReferenceNumber: String,
  faculty: [FacultySchema],
  meetingTime: {
    beginTime: String,
    building: String,
    buildingDescription: String,
    campus: String,
    campusDescription: String,
    category: String,
    class: String,
    courseReferenceNumber: String,
    creditHourSession: Number,
    endDate: String,
    endTime: String,
    friday: Boolean,
    hoursWeek: Number,
    meetingScheduleType: String,
    monday: Boolean,
    room: String,
    saturday: Boolean,
    startDate: String,
    sunday: Boolean,
    term: String,
    thursday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean
  },
  term: Number
});

export const CourseSchema = new Schema({
  _id: String,
  id: Number,
  term: String,
  termDesc: String,
  courseReferenceNumber: String,
  partOfTerm: String,
  courseNumber: String,
  subject: String,
  subjectDescription: String,
  sequenceNumber: String,
  campusDescription: String,
  scheduleTypeDescription: String,
  courseTitle: String,
  creditHours: String,
  maximumEnrollment: Number,
  enrollment: Number,
  seatsAvailable: Number,
  waitCapacity: Number,
  waitCount: Number,
  waitAvailable: Number,
  crossList: String,
  crossListCapacity: String,
  crossListCount: String,
  crossListAvailable: String,
  creditHourHigh: String,
  creditHourLow: Number,
  creditHourIndicator: String,
  openSection: Boolean,
  linkIdentifier: String,
  isSectionLinked: Boolean,
  subjectCourse: String,
  faculty: [FacultySchema],
  meetingsFaculty: [MeetingsFacultySchema]
});

export const TermSchema = new Schema({
  _id: String,
  code: Number,
  description: String
});

export const SubjectSchema = new Schema({
  _id: String,
  code: String,
  description: String
});

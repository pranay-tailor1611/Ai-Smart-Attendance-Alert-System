import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

const subjects = ['Mathematics', 'Physics', 'Programming Lab', 'English'];
const statuses = ['Present', 'Present', 'Present', 'Absent'];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Student.deleteMany({}), Attendance.deleteMany({})]);

  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
  });

  const faculty = await User.create({
    name: 'Dr. Sharma',
    email: 'faculty@college.edu',
    password: 'faculty123',
    role: 'faculty',
  });

  const studentsData = [
    { name: 'Rahul Verma', enrollmentNumber: 'EN2024001', email: 'rahul@student.edu', course: 'B.Tech CSE', semester: '4', section: 'A' },
    { name: 'Priya Singh', enrollmentNumber: 'EN2024002', email: 'priya@student.edu', course: 'B.Tech CSE', semester: '4', section: 'A' },
    { name: 'Amit Kumar', enrollmentNumber: 'EN2024003', email: 'amit@student.edu', course: 'B.Tech ECE', semester: '4', section: 'B' },
  ];

  for (const s of studentsData) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: 'student123',
      role: 'student',
    });
    const student = await Student.create({ ...s, userId: user._id });
    user.studentProfile = student._id;
    await user.save();

    for (let d = 30; d >= 0; d -= 3) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      for (const subject of subjects) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        await Attendance.create({
          studentId: student._id,
          date,
          subject,
          status,
          markedBy: faculty._id,
        });
      }
    }
  }

  console.log('Seed complete!');
  console.log('Admin: admin@college.edu / admin123');
  console.log('Faculty: faculty@college.edu / faculty123');
  console.log('Students: *@student.edu / student123');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

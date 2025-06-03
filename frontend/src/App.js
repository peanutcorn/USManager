import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Student_MainUI from './components/Student_MainUI';
import CourseRegistration from './components/CourseRegistration';
import RegisteredCourses from './components/RegisteredCourses';
import ConfirmedCourses from './components/ConfirmedCourses';

const App = () => { // 메인 앱 컴포넌트
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/student" element={<Student_MainUI />} />
                <Route path="/student/course-registration" element={<CourseRegistration />} />
                <Route path="/student/registered-courses" element={<RegisteredCourses />} />
                <Route path="/student/confirmed-courses" element={<ConfirmedCourses />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};
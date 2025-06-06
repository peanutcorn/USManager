import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Student_MainUI from './components/Student_MainUI';
import CourseRegistration from './components/CourseRegistration';
import RegisteredCourses from './components/RegisteredCourses';
import ConfirmedCourses from './components/ConfirmedCourses';
import Professor_MainUI from './components/Professor_MainUI';
import Scores_InputFix from "./components/Scores_InputFix";

const App = () => { // 메인 앱 컴포넌트
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Route path="/student" element={<Student_MainUI />} />
                <Route path="/course-registration" element={<CourseRegistration />} />
                <Route path="/student/registered-courses" element={<RegisteredCourses />} />
                <Route path="/student/confirmed-courses" element={<ConfirmedCourses />} />
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Route path="/professor" element={<Professor_MainUI />} />
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Route path="/professor/grade-input" element={<Scores_InputFix />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
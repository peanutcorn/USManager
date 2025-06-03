import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    styled,
} from '@mui/material';
import axios from 'axios';

const container = styled(Container)(({ theme }) => ({
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    }));
const paper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
    }));
const searchSection = styled('div')(({ theme }) => ({
        marginBottom: theme.spacing(4),
    }));
const button = styled(Button)(({ theme }) => ({
        margin: theme.spacing(1),
    }));
const tableContainer = styled(TableContainer)(({ theme }) => ({
        marginTop: theme.spacing(3),
    }));

const CourseRegistration = () => {
    const [majorSearch, setMajorSearch] = useState('');
    const [subjectSearch, setSubjectSearch] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const studentInfo = JSON.parse(localStorage.getItem('user'));

    const handleSearchMajor = async () => {
        try {
            const response = await axios.post('/api/courses/search-major', {
                major: majorSearch
            });
            setCourses(response.data);
        } catch (error) {
            console.error('학과 검색 에러:', error);
        }
    };

    // 강의명 검색
    const handleSearchSubjects = async () => {
        try {
            const response = await axios.post('/api/courses/search-subjects', {
                subject: subjectSearch
            });
            setCourses(response.data);
        } catch (error) {
            console.error('검색 에러:', error);
        }
    };

    // 수강신청 처리 함수
    const handleRegisterSubject = async (courseId) => {
        try {
            // 학생이 이미 수강신청 했다면
            if (await same_subject(courseId, studentInfo.id)) {
                alert('이미 수강신청한 강좌입니다.');
                return;
            }

            // 수강인원이 초과되었는지 확인
            if (await MAX_STU(courseId)) {
                ms_Studendexceed();
                return;
            }

            // 수강신청 요청
            const response = await axios.post('/api/courses/register', {
                studentId: studentInfo.id,
                courseId: courseId
            });

            if (response.data.success) {
                ms_ConfirmRegisterSubject();
                // 수강신청 후 신청 목록 갱신
                const updatedList = await search_subID_StudentID_list(studentInfo.id);
                setSelectedCourses(updatedList);
            }
        } catch (error) {
            console.error('수강 신청 에러:', error);
        }
    };

    // 신청 강의 패칭 함수
    const search_subID_StudentID_list = async (studentId) => {
        try {
            const response = await axios.get(`/api/courses/registered/${studentId}`);
            return response.data;
        } catch (error) {
            console.error('신청 강의 패칭 에러:', error);
            return [];
        }
    };

    // 알림 함수들
    const ms_Studendexceed = () => {
        alert('수강신청 인원이 초과되었습니다.');
    };

    const ms_ConfirmRegisterSubject = () => {
        alert('수강신청이 완료되었습니다.');
    };

    // 인원초과 체크 함수
    const MAX_STU = async (courseId) => {
        try {
            const response = await axios.get(`/api/courses/check-capacity/${courseId}`);
            return response.data.isExceeded;
        } catch (error) {
            console.error('신청목록 인원 초과 에러:', error);
            return true;
        }
    };

    const same_subject = async (courseId, studentId) => {
        try {
            const response = await axios.get(`/api/courses/check-duplicate/${courseId}/${studentId}`);
            return response.data.isDuplicate;
        } catch (error) {
            console.error('듀플리케이트가 나네:', error);
            return true;
        }
    };

    return (
        <container>
            <paper>
                <Typography variant="h5" gutterBottom>
                    수강신청
                </Typography>

                <searchSection>
                    <TextField
                        label="학과 검색"
                        value={majorSearch}
                        onChange={(e) => setMajorSearch(e.target.value)}
                        margin="normal"
                    />
                    <button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchMajor}
                    >
                        학과 검색
                    </button>

                    <TextField
                        label="강의명 검색"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        margin="normal"
                    />
                    <button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchSubjects}
                    >
                        강의명 검색
                    </button>
                </searchSection>

                <tableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>과목코드</TableCell>
                                <TableCell>과목명</TableCell>
                                <TableCell>담당교수</TableCell>
                                <TableCell>학과</TableCell>
                                <TableCell>수강인원</TableCell>
                                <TableCell>액션</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.id}</TableCell>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.professor}</TableCell>
                                    <TableCell>{course.major}</TableCell>
                                    <TableCell>{course.currentStudents}/{course.maxStudents}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleRegisterSubject(course.id)}
                                        >
                                            수강신청
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </tableContainer>
            </paper>
        </container>
    );
};

export default CourseRegistration;
import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    makeStyles,
} from '@mui/material';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3),
    },
    tableContainer: {
        marginTop: theme.spacing(3),
    },
}));

const RegisteredCourses = () => {
    const classes = useStyles();
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const studentInfo = JSON.parse(localStorage.getItem('user'));

    // 컴포넌트가 마운트될 때 수강신청 확정목록을 가져오는 함수
    useEffect(() => {
        const fetchRegisteredCourses = async () => {
            try {
                const courses = await search_subID_StudentID_list(studentInfo.id);
                setRegisteredCourses(courses);
            } catch (error) {
                console.error('수강신청 패칭 에러:', error);
            }
        };

        // 초기 데이터 로드
        fetchRegisteredCourses();
    }, [studentInfo.id]);

    // 수강신청 확정목록 조회 함수
    const search_subID_StudentID_list = async (studentId) => {
        try {
            const response = await axios.get(`/api/courses/registered/${studentId}`);
            return response.data;
        } catch (error) {
            console.error('수강 신청 패칭 에러:', error);
            return [];
        }
    };

    return (
        <Container className={classes.container}>
            <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                    수강신청 확정목록
                </Typography>

                <TableContainer className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>과목코드</TableCell>
                                <TableCell>과목명</TableCell>
                                <TableCell>담당교수</TableCell>
                                <TableCell>학과</TableCell>
                                <TableCell>수강인원</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registeredCourses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.id}</TableCell>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.professor}</TableCell>
                                    <TableCell>{course.major}</TableCell>
                                    <TableCell>{course.currentStudents}/{course.maxStudents}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default RegisteredCourses;
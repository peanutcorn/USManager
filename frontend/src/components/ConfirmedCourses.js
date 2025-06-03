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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    makeStyles
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    tableContainer: {
        marginTop: theme.spacing(3),
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
    currentTime: {
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
    }
}));

const ConfirmedCourses = () => {
    const classes = useStyles();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const studentInfo = JSON.parse(localStorage.getItem('user'));

    // 수강신청 확정목록 조회 함수
    const Confirmed_Subject_view = async () => {
        try {
            const response = await axios.get(`/api/registered-courses/student/${studentInfo.id}`);
            setCourses(response.data);
        } catch (error) {
            console.error('수강확정 목록 패칭 에러:', error);
        }
    };

    // 수강취소 함수
    const drop_sub = async (subjectId) => {
        try {
            await axios.delete(`/api/registered-courses/${studentInfo.id}/${subjectId}`);
            await Confirmed_Subject_view(); // 리스트 새로고침
            setOpenDialog(false);
        } catch (error) {
            console.error('수강 취소 에러:', error);
        }
    };

    // 뷰 버튼
    const handleViewClick = () => {
        Confirmed_Subject_view();
    };

    // 삭제 버튼 클릭 핸들러
    const handleDeleteClick = (course) => {
        setSelectedCourse(course);
        setOpenDialog(true);
    };

    useEffect(() => {
        // 수강신청 확정목록 조회
        Confirmed_Subject_view();

        // 현재 시간 업데이트
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Container className={classes.container}>
            <Paper className={classes.paper}>
                <div className={classes.header}>
                    <Typography variant="h5">
                        수강신청 확정목록
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleViewClick}
                    >
                        새로고침
                    </Button>
                </div>

                <Typography className={classes.currentTime}>
                    Current Time (UTC): {currentTime}
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
                                <TableCell>액션</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.subjectId}>
                                    <TableCell>{course.subjectId}</TableCell>
                                    <TableCell>{course.subjectName}</TableCell>
                                    <TableCell>{course.professorName}</TableCell>
                                    <TableCell>{course.major}</TableCell>
                                    <TableCell>{course.currentStudents}</TableCell>
                                    <TableCell>
                                        <Button
                                            className={classes.deleteButton}
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteClick(course)}
                                        >
                                            삭제
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>수강신청 취소</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {selectedCourse?.subjectName} 과목의 수강신청을 취소하시겠습니까?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            취소
                        </Button>
                        <Button
                            onClick={() => drop_sub(selectedCourse?.subjectId)}
                            color="secondary"
                        >
                            확인
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default ConfirmedCourses;
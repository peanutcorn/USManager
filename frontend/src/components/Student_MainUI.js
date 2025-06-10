import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    makeStyles, styled
} from '@mui/material';

const container = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}))
const paper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}))
const header = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(4),
}))
const button = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    width: '300px',
}))
const buttonIcon = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
}))

const Student_MainUI = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        axios.get('/api/auth/check', { withCredentials: true })
            .then(res => {
                if (res.data.role !== "student") {
                    alert('학생 권한만 접근 가능합니다.');
                    navigate('/login');
                } else {
                    setStudentInfo(res.data);
                    setLoading(false);
                }
            })
            .catch(() => {
                alert('로그인이 필요합니다.');
                navigate('/login');
            });
    }, [navigate]);

    if (loading) return <div>로딩중...</div>;

    // studentId는 res.data.studentId로 전달됨 (백엔드, 로그인 연동 기준)
    // studentInfo.id가 아니라 studentInfo.studentId를 CourseRegistration에 넘겨야 함!
    // 아래에서 navigate 시 state로 studentId를 넘기고, CourseRegistration에서 이를 받음

    const handleGoCourseRegistration = () => {
        navigate('/student/course-registration', {
            state: { studentId: studentInfo.studentId }
        });
    };

    const handleGoRegistreredCourses = () => {
        navigate('/student/registered-courses', {
            state: { studentId: studentInfo.studentId }
        });
    };

    return (
        <container>
            <paper elevation={3}>
                <header>
                    <Typography variant="h4" gutterBottom>
                        학생 포털
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`학번: ${studentInfo.studentId} | 이름: ${studentInfo.name} | 학과: ${studentInfo.major || ''}`}
                    </Typography>
                </header>

                <Grid container direction="column" spacing={3} alignItems="center">
                    <Grid item>
                        <button
                            variant="contained"
                            color="primary"
                            onClick={handleGoCourseRegistration}
                            startIcon={<buttonIcon/>}
                        >
                            수강신청
                        </button>
                    </Grid>
                    <Grid item>
                        <button
                            variant="contained"
                            color="secondary"
                            onClick={handleGoRegistreredCourses}
                            startIcon={<buttonIcon/>}
                        >
                            수강신청 확정목록 조회
                        </button>
                    </Grid>
                    <Grid item>
                        <button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/student/confirmed-courses')}
                            startIcon={<buttonIcon/>}
                        >
                            수강정정
                        </button>
                    </Grid>
                </Grid>
            </paper>
        </container>
    );
};

export default Student_MainUI;
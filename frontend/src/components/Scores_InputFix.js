import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    styled,
} from '@mui/material';
import axios from 'axios';

const container = styled(Container)(({ theme }) => ({
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    }))
const paper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
    }))
const searchSection = styled('div')(({ theme }) => ({
        marginBottom: theme.spacing(4),
        display: 'flex',
        gap: theme.spacing(2),
    }))
const formControl = styled(FormControl)(({ theme }) => ({
        minWidth: 120,
    }))
const currentTime = styled(Typography)(({ theme }) => ({
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
    }))

const GradeInput = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const [courseName, setCourseName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [students, setStudents] = useState([]);
    const [gradeData, setGradeData] = useState({});
    const professorInfo = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // 성적 입력 기간 확인
        const checkGradeInputPeriod = async () => {
            try {
                const canInput = await grade_input_time();
                if (!canInput) {
                    ms_no_time_Scoresinput();
                    navigate('/professor');
                }
            } catch (error) {
                console.error('성적 입력 기간 에러:', error);
            }
        };

        checkGradeInputPeriod();

        // 현재 시간 업데이트
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    // 학생 조회 함수
    const handleSearch = async () => {
        try {
            const response = await axios.get('/api/grades/students', {
                params: {
                    courseName: courseName,
                    studentName: studentName,
                    professorId: professorInfo.id
                }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('학생 조회 에러:', error);
        }
    };

    // 성적 변경 핸들러
    const handleGradeChange = (studentId, field, value) => {
        setGradeData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    // 성적 유효성 검사 함수
    const validation_grades = (scores) => {
        const total = Object.values(scores).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        return total >= 0 && total <= 100;
    };

    // 성적이 null인 경우 0으로 변환하는 함수
    const Null_Calcul = (scores) => {
        return Object.fromEntries(
            Object.entries(scores).map(([key, value]) => [key, value || 0])
        );
    };

    // 성적 저장 함수
    const handleSave = async () => {
        for (const studentId in gradeData) {
            const scores = Null_Calcul(gradeData[studentId]);

            if (!scores.grade) {
                ms_no_input_grade(); // 등급이 입력되지 않은 경우
                return;
            }

            if (!validation_grades(scores)) { // 성적 유효성 검사
                ms_no_vaildation_grades();
                return;
            }

            try { // 성적이 이미 입력되었는지 체크
                const existingGrade = await axios.get(`/api/grades/${studentId}/${courseName}`);
                if (existingGrade.data) {
                    await grade_Fix(scores, studentId, courseName);
                } else {
                    await grade_Add(scores, studentId, courseName);
                }
            } catch (error) {
                console.error('성적 저장 중 에러:', error);
                return;
            }
        }
        ms_save();
    };

    // 성적 입력 기간 확인 함수
    const grade_input_time = async () => {
        try {
            const response = await axios.get('/api/grades/input-period');
            return response.data.isInputPeriod;
        } catch (error) {
            console.error('성적 입력 기간 에러:', error);
            return false;
        }
    };

    // 성적 수정 및 추가 함수
    const grade_Fix = async (scores, studentId, courseName) => {
        await axios.put(`/api/grades/${studentId}/${courseName}`, scores);
    };

    // 성적 추가 함수
    const grade_Add = async (scores, studentId, courseName) => {
        await axios.post('/api/grades', {
            studentId,
            courseName,
            ...scores
        });
    };

    // 알림 함수들
    const ms_save = () => {
        alert('성적이 성공적으로 저장되었습니다.');
    };

    const ms_no_time_Scoresinput = () => {
        alert('성적 입력 기간이 아닙니다.');
    };

    const ms_no_vaildation_grades = () => {
        alert('성적 총합이 0~100점이 되게 입력해주세요.');
    };

    const ms_no_input_grade = () => {
        alert('등급을 설정하지 않았습니다.');
    };

    return (
        <container>
            <paper>
                <Typography variant="h5" gutterBottom>
                    성적 입력
                </Typography>

                <currentTime>
                    Current Time (UTC): {currentTime}
                </currentTime>

                <searchSection>
                    <TextField
                        label="강좌명"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                    <TextField
                        label="학생 이름"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        조회
                    </Button>
                </searchSection>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>학번</TableCell>
                                <TableCell>이름</TableCell>
                                <TableCell>학년</TableCell>
                                <TableCell>중간고사</TableCell>
                                <TableCell>기말고사</TableCell>
                                <TableCell>과제</TableCell>
                                <TableCell>출석</TableCell>
                                <TableCell>등급</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.id}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.year}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            inputProps={{ min: 0, max: 100 }}
                                            value={gradeData[student.id]?.midterm || ''}
                                            onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            inputProps={{ min: 0, max: 100 }}
                                            value={gradeData[student.id]?.final || ''}
                                            onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            inputProps={{ min: 0, max: 100 }}
                                            value={gradeData[student.id]?.assignment || ''}
                                            onChange={(e) => handleGradeChange(student.id, 'assignment', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            inputProps={{ min: 0, max: 100 }}
                                            value={gradeData[student.id]?.attendance || ''}
                                            onChange={(e) => handleGradeChange(student.id, 'attendance', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <formControl>
                                            <InputLabel>등급</InputLabel>
                                            <Select
                                                value={gradeData[student.id]?.grade || ''}
                                                onChange={(e) => handleGradeChange(student.id, 'grade', e.target.value)}
                                            >
                                                {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].map((grade) => (
                                                    <MenuItem key={grade} value={grade}>
                                                        {grade}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </formControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ marginTop: '20px' }}
                >
                    성적 저장
                </Button>
            </paper>
        </container>
    );
};

export default GradeInput;
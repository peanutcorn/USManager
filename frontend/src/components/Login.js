import logoImg from '../assets/loginStudent.png';
import React, { useState } from 'react';
import axios from 'axios';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";

// 로그인 컴포넌트
const Login = () => {
    const [formData, setFormData] = useState({ // 초기 상태 설정
        id: '',
        password: ''
    });
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    };

    const determineUserType = (id) => { // ID에 따라 사용자 유형을 결정하는 함수
        if (id.startsWith('A')) {
            return 'Admin';
        } else if (id.length === 8) {
            return 'Student';
        } else if (id.length === 10) {
            return 'Professor';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            if (response.data.status === 'success') {
                const { user } = response.data;
                console.log('Login successful:', user);

                // 사용자 유형 결정
                localStorage.setItem('user', JSON.stringify(user));

                // 로그인 성공 후 사용자 유형 결정
                switch (user.userType) {
                    case 'student':
                        // 학생 대시보드로 리다이렉트
                        break;
                    case 'professor':
                        // 교수 대시보드로 리다이렉트
                        break;
                    case 'admin':
                        // 관리자 대시보드로 리다이렉트
                        break;
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || '로그인 실패. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                bgcolor: "white",
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Container
                sx={{ position: "relative", height: "900px", maxWidth: "1440px" }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute",
                        top: "30px",
                        left: "42px",
                        fontWeight: 600,
                    }}
                >
                    학사 관리 프로그램
                </Typography>

                <Box sx={{ width: "100%", maxWidth: 460, marginTop: "184px", padding: 2 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: "'Poppins', Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            fontSize: "50px",
                            color: "black",
                            lineHeight: "normal",
                            marginBottom: 2,
                        }}
                    >
                        동의대학교 로그인
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: "'Poppins', Helvetica, Arial, sans-serif",
                            fontWeight: 500,
                            fontSize: "35px",
                            color: "black",
                            lineHeight: "normal",
                        }}
                    >
                        학번을 이용하여 로그인하세요.
                    </Typography>
                </Box>

                <Box
                    component="img"
                    src={logoImg}
                    alt="Student illustration"
                    sx={{
                        position: "absolute",
                        width: "313px",
                        height: "498px",
                        top: "294px",
                        left: "175px",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        width: "371px",
                        height: "377px",
                        top: "174px",
                        left: "892px",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 500,
                            mb: 4,
                        }}
                    >
                        로그인
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="학번"
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                height: "62px",
                                bgcolor: "#efefff",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#a7a2ff",
                                opacity: 1,
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                        sx={{
                            mb: 5,
                            "& .MuiOutlinedInput-root": {
                                height: "62px",
                                bgcolor: "#efefff",
                                borderRadius: "8px",
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: "#a7a2ff",
                                opacity: 1,
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            height: "59px",
                            bgcolor: "#4d47c3",
                            borderRadius: "9px",
                            boxShadow: "0px 4px 61px rgba(77, 71, 195, 0.4)",
                            "&:hover": {
                                bgcolor: "#3f3ba3",
                            },
                        }}
                    >
                        로그인
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
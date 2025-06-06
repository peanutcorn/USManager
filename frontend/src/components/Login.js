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
import {useNavigate} from "react-router-dom";

// axios 기본 설정을 분리된 파일로 이동
const API_BASE_URL = 'http://localhost:8080';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';

// 로그인 컴포넌트
const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ // 초기 상태 설정
        id: '',
        passwords: ''
    });
    const [error, setError] = useState(''); // 에러 메시지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태

    const [showpasswords, setShowpasswords] = useState(false);

    const handleClickShowpasswords = () => {
        setShowpasswords(!showpasswords);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (error) setError('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // 실제로 값이 들어오는지 체크
        console.log('id:', id, 'password:', password);

        if (!id || !password) {
            setError('ID and password are required');
            return;
        }

        try {
            console.log('Sending login request:', { id, password }); // 디버깅용

            const response = await axios.post('http://localhost:8080/auth/login', {
                id,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Login response:', response.data); // 디버깅용

            // 응답 구조 확인
            if (response.data.success) {
                // 로그인 성공
                const userData = response.data.user;
                console.log('Login successful:', userData);

                // 세션에 사용자 정보 저장
                sessionStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userRole', response.data.role);

                // 사용자 유형에 따른 리다이렉션
                switch (response.data.role) {
                    case 'student':
                        navigate('/student');
                        break;
                    case 'professor':
                        navigate('/professor');
                        break;
                    case 'admin':
                        navigate('/admin');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                // 로그인 실패
                console.error('Login failed:', response.data.message);
                setError(response.data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);

            // 에러 응답 구조 확인
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(error.response.data.message || 'Login failed. Please try again.');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setError('Network error. Please check your connection.');
            } else {
                console.error('Error message:', error.message);
                setError('An unexpected error occurred.');
            }
        }
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
                    <form onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            placeholder="학번"
                            id="id"
                            label="ID"
                            name="id"
                            autoComplete="off"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            error={!!error}
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
                            name="passwords"
                            label="passwords"
                            id="passwords"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            error={!!error}
                            autoComplete="current-passwords"
                            type={showpasswords ? "text" : "passwords"}
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
                                        <IconButton onClick={handleClickShowpasswords} edge="end">
                                            {showpasswords ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && (
                            <Typography variant="body2">
                                {error}
                            </Typography>
                        )}
                    <Button
                        type="submit"
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
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
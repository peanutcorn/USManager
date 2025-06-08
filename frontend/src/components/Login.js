import logoImg from '../assets/loginStudent.png';
import React, { useState, useEffect } from 'react';
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
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// axios 기본 설정
const API_BASE_URL = 'http://localhost:8080';
axios.defaults.baseURL = API_BASE_URL;

// 세션 관리 유틸리티
const SessionManager = {
    setSession: (sessionId, userData) => {
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('userData', JSON.stringify(userData));
        // axios 기본 헤더에 세션 ID 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionId}`;
    },

    getSession: () => {
        const sessionId = localStorage.getItem('sessionId');
        const userData = localStorage.getItem('userData');
        return {
            sessionId,
            userData: userData ? JSON.parse(userData) : null
        };
    },

    clearSession: () => {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userData');
        delete axios.defaults.headers.common['Authorization'];
    },

    isLoggedIn: () => {
        return !!localStorage.getItem('sessionId');
    }
};

// 로그인 컴포넌트
const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 이미 로그인되어 있는지 확인
    useEffect(() => {
        if (SessionManager.isLoggedIn()) {
            const { userData } = SessionManager.getSession();
            if (userData && userData.role) {
                redirectToUserPage(userData.role);
            }
        }
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const redirectToUserPage = (role) => {
        switch (role) {
            case "student":
                navigate('/student');
                break;
            case "professor":
                navigate('/professor');
                break;
            case "admin":
                navigate('/admin');
                break;
            default:
                setError("알 수 없는 사용자 유형입니다.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // 입력값 검증
        if (!id.trim() || !password.trim()) {
            setError('ID와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', {
                id: id.trim(),
                password: password.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success && response.data.sessionId) {
                // 세션 정보 저장
                SessionManager.setSession(response.data.sessionId, {
                    role: response.data.role,
                    name: response.data.name,
                    studentId: response.data.studentId,
                    professorId: response.data.professorId,
                    adminId: response.data.adminId
                });

                // 성공 메시지 표시 후 페이지 이동
                console.log(`${response.data.name}님 로그인 성공`);
                redirectToUserPage(response.data.role);
            } else {
                setError('로그인에 실패했습니다.');
            }
        } catch (err) {
            console.error('Login error:', err);

            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.status === 500) {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else if (err.code === 'NETWORK_ERROR') {
                setError('네트워크 연결을 확인해주세요.');
            } else {
                setError('로그인 중 알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError(''); // 입력 시 에러 메시지 클리어
    };

    return (
        <Box
            sx={{
                bgcolor: "white",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                minHeight: "100vh",
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
                        minHeight: "377px",
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

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            placeholder="학번 또는 ID"
                            id="id"
                            label="ID"
                            name="id"
                            autoComplete="username"
                            value={id}
                            onChange={handleInputChange(setId)}
                            error={!!error}
                            disabled={loading}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    height: "62px",
                                    bgcolor: "#efefff",
                                    borderRadius: "8px",
                                    "& fieldset": {
                                        borderColor: "transparent",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#4d47c3",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#4d47c3",
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
                            name="password"
                            label="비밀번호"
                            id="password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            error={!!error}
                            disabled={loading}
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    height: "62px",
                                    bgcolor: "#efefff",
                                    borderRadius: "8px",
                                    "& fieldset": {
                                        borderColor: "transparent",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#4d47c3",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#4d47c3",
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
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            disabled={loading}
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || !id.trim() || !password.trim()}
                            sx={{
                                height: "59px",
                                bgcolor: "#4d47c3",
                                borderRadius: "9px",
                                boxShadow: "0px 4px 61px rgba(77, 71, 195, 0.4)",
                                "&:hover": {
                                    bgcolor: "#3f3ba3",
                                },
                                "&:disabled": {
                                    bgcolor: "#cccccc",
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "로그인"
                            )}
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

// SessionManager를 전역에서 사용할 수 있도록 export
export { SessionManager };
export default Login;
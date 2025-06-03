import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Box,
    Typography,
    styled,
    Paper,
    Container,
    CircularProgress
} from '@mui/material';

const loginContainer = styled('div')(( { theme }) => ({
        width: '448px',
        padding: '48px 40px 36px',
        margin: 'auto',
        marginTop: theme.spacing(8),
    }))
const logo = styled('div')(( { theme }) => ({
        width: '75px',
        height: '75px',
        backgroundColor: '#4285f4',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 500,
        margin: 'auto',
        marginBottom: theme.spacing(2),
    }))
 const form = styled('form')(( { theme }) => ({
        width: '100%',
        marginTop: theme.spacing(1),
    }))
const submit = styled('button')(( { theme }) => ({
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1.5),
        backgroundColor: '#4285f4',
        '&:hover': {
            backgroundColor: '#357abd',
        },
    }))
const error = styled(Typography)(( { theme }) => ({
        color: theme.palette.error.main,
        textAlign: 'center',
        marginTop: theme.spacing(2),
    }))
const textField = styled(TextField)(( { theme }) => ({
        marginBottom: theme.spacing(2),
    }))

// 로그인 폼 스타일링
const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#dadce0',
            borderRadius: '4px',
        },
        '&:hover fieldset': {
            borderColor: '#dadce0',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1a73e8',
            borderWidth: '2px',
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '12px 14px',
    },
    '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px) scale(1)',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
    },
});

// 버튼 스타일링
const StyledButton = styled(Button)({
    backgroundColor: '#1a73e8',
    color: '#fff',
    textTransform: 'none',
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: '#1557b0',
    },
});

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
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} className={loginContainer}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <div className={logo}>
                        동의대
                    </div>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>

                    <form className={form} onSubmit={handleSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="id"
                            label="아이디"
                            name="id"
                            autoComplete="off"
                            autoFocus
                            onChange={handleChange}
                            value={formData.id}
                            className={textField}
                            error={!!error}
                            disabled={loading}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            onChange={handleChange}
                            autoComplete="current-password"
                            value={formData.password}
                            className={textField}
                            error={!!error}
                            disabled={loading}
                        />
                        {error && (
                            <Typography className={error} variant="body2">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={submit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
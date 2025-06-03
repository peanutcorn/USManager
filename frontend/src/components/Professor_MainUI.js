import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    styled,
} from '@mui/material';
import { Grade, ExitToApp } from '@mui/icons-material';

const container = styled(Container)(({ theme }) => ({
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    }))
const paper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
    }))
const header = styled('div')(({ theme }) => ({
        marginBottom: theme.spacing(4),
    }))
const button= styled(Button)(({ theme }) => ({
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        width: '300px',
    }))
const userInfo = styled('div')(({ theme }) => ({
        marginBottom: theme.spacing(3),
    }))

const Professor_MainUI = () => {
    const navigate = useNavigate();
    const professorInfo = JSON.parse(localStorage.getItem('user'));

    return (
        <container>
            <paper>
                <header>
                    <Typography variant="h4" gutterBottom>
                        교수 포털
                    </Typography>
                    <userInfo>
                        <Typography variant="subtitle1" color="textSecondary">
                            {`교수번호: ${professorInfo?.id} | 이름: ${professorInfo?.name} | 학과: ${professorInfo?.major}`}
                        </Typography>
                    </userInfo>
                </header>

                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item>
                        <button
                            variant="contained"
                            color="primary"
                            startIcon={<Grade />}
                            onClick={() => navigate('/professor/grade-input')}
                        >
                            성적 입력
                        </button>
                    </Grid>
                    <Grid item>
                        <button
                            variant="contained"
                            color="secondary"
                            startIcon={<ExitToApp />}
                            onClick={() => navigate('/login')}
                        >
                            로그아웃
                        </button>
                    </Grid>
                </Grid>
            </paper>
        </container>
    );
};

export default Professor_MainUI;
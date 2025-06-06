import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const user = JSON.parse(sessionStorage.getItem('user'));
console.log(user);

const Student_MainUI = () => {
    const navigate = useNavigate();
    const studentInfo = JSON.parse(localStorage.getItem('user'));

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    if (!user) {
        return <div>로그인이 필요합니다.</div>;
    }

    return (
        <container>
            <paper elevation={3}>
                <header>
                    <Typography variant="h4" gutterBottom>
                        학생 포털
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`학번: ${user?.id} | 이름: ${user?.name} | 학과: ${user?.major}`}
                    </Typography>
                </header>

                <Grid container direction="column" spacing={2} alignItems="center">
                    <Grid item>
                        <button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/course-registration')}
                            startIcon={<buttonIcon/>}
                        >
                            수강신청
                        </button>
                    </Grid>
                    <Grid item>
                        <button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/registered-courses')}
                            startIcon={<buttonIcon/>}
                        >
                            수강신청 확정목록 조회
                        </button>
                    </Grid>
                </Grid>
            </paper>
        </container>
    );
};

export default Student_MainUI;
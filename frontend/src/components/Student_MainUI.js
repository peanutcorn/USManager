import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    makeStyles
} from '@mui/material';
import { School, ListAlt } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        marginBottom: theme.spacing(4),
    },
    button: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        width: '300px',
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
    }
}));

const Student_MainUI = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const studentInfo = JSON.parse(localStorage.getItem('user'));

    return (
        <Container className={classes.container}>
            <Paper className={classes.paper} elevation={3}>
                <div className={classes.header}>
                    <Typography variant="h4" gutterBottom>
                        학생 포털
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {`학번: ${studentInfo?.id} | 이름: ${studentInfo?.name} | 학과: ${studentInfo?.major}`}
                    </Typography>
                </div>

                <Grid container direction="column" spacing={2} alignItems="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => navigate('/course-registration')}
                            startIcon={<School className={classes.buttonIcon} />}
                        >
                            수강신청
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => navigate('/registered-courses')}
                            startIcon={<ListAlt className={classes.buttonIcon} />}
                        >
                            수강신청 확정목록 조회
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Student_MainUI;
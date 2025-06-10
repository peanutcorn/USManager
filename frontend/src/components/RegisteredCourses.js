import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RegisteredCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRegisteredCourses = async () => {
        setLoading(true);
        setError('');
        try {
            let url = '/api/courses/registered';
            const res = await axios.get(url, { withCredentials: true });
            if (res.data && Array.isArray(res.data.courses)) {
                setCourses(res.data.courses);
            } else if (res.data && res.data.error) {
                setError(res.data.error);
            } else {
                setError('수강신청 내역을 불러오지 못했습니다.');
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                (err.response && typeof err.response.data === 'string' ? err.response.data : '') ||
                '서버 오류로 정보를 불러올 수 없습니다.'
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRegisteredCourses();
    }, []);

    return (
        <div>
            <h2>수강신청 내역</h2>
            {loading && <p>로딩 중...</p>}
            {error && <p style={{color:'red', whiteSpace: 'pre-line'}}>{error}</p>}
            {!loading && !error && (
                <table border="1" style={{ width: '100%', marginTop: 20 }}>
                    <thead>
                    <tr>
                        <th>과목ID</th>
                        <th>과목명</th>
                        <th>교수명</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.length === 0 && (
                        <tr>
                            <td colSpan={4}>수강 신청 내역이 없습니다.</td>
                        </tr>
                    )}
                    {courses.map(course => (
                        <tr key={course.enrollmentId}>
                            <td>{course.subjectId}</td>
                            <td>{course.subjectName}</td>
                            <td>{course.professorName}</td>
                            <td>{course.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default RegisteredCourses;
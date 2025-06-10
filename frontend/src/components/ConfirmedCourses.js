import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ConfirmedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 수강 확정된 과목 목록 불러오기
    const fetchConfirmedCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('/api/confirmed-courses', { withCredentials: true });
            if (res.data && Array.isArray(res.data.courses)) {
                setCourses(res.data.courses);
            } else if (res.data && res.data.error) {
                setError(res.data.error);
            } else {
                setError('수강 확정된 과목 정보를 불러오지 못했습니다.');
            }
        } catch (err) {
            // 500에러도 포함해 서버에서 내려준 메시지가 있으면 보여주기
            setError(
                err.response?.data?.error ||
                (err.response && typeof err.response.data === 'string' ? err.response.data : '') ||
                '서버 오류로 정보를 불러올 수 없습니다.'
            );
        }
        setLoading(false);
    };

    // 수강 확정 취소
    const cancelConfirmedCourse = async (enrollmentId) => {
        if (!window.confirm('정말로 이 과목의 수강신청을 취소하시겠습니까?')) return;
        try {
            const res = await axios.delete(`/api/confirmed-courses/${enrollmentId}`, { withCredentials: true });
            if (res.data && res.data.success) {
                setCourses(courses.filter(c => c.enrollmentId !== enrollmentId));
                alert('수강신청이 취소되었습니다.');
            } else if (res.data && res.data.error) {
                alert(res.data.error);
            } else {
                alert('취소에 실패했습니다.');
            }
        } catch (err) {
            alert(
                err.response?.data?.error ||
                (err.response && typeof err.response.data === 'string' ? err.response.data : '') ||
                '서버 오류로 취소에 실패했습니다.'
            );
        }
    };

    useEffect(() => {
        fetchConfirmedCourses();
    }, []);

    return (
        <div>
            <h2>수강신청 과목 목록</h2>
            {loading && <p>로딩 중...</p>}
            {error && <p style={{color:'red', whiteSpace: 'pre-line'}}>{error}</p>}
            {!loading && !error && (
                <table border="1" style={{ width: '100%', marginTop: 20 }}>
                    <thead>
                    <tr>
                        <th>과목ID</th>
                        <th>과목명</th>
                        <th>교수명</th>
                        <th>신청 취소</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.length === 0 && (
                        <tr>
                            <td colSpan={4}>수강 신청된 과목이 없습니다.</td>
                        </tr>
                    )}
                    {courses.map(course => (
                        <tr key={course.enrollmentId}>
                            <td>{course.subjectId}</td>
                            <td>{course.subjectName}</td>
                            <td>{course.professorName}</td>
                            <td>
                                <button onClick={() => cancelConfirmedCourse(course.enrollmentId)}>
                                    취소
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ConfirmedCourses;
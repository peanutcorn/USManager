import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ConfirmedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    const fetchConfirmedCourses = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching confirmed courses...');
            const res = await axios.get('/api/courses', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response:', res.data);

            if (res.data && res.data.success && Array.isArray(res.data.courses)) {
                setCourses(res.data.courses);
            } else if (res.data && res.data.error) {
                setError(res.data.error);
            } else {
                setError('수강 확정된 과목 정보를 불러오지 못했습니다.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            if (err.response?.status === 401) {
                setError('로그인이 필요합니다. 다시 로그인해주세요.');
            } else if (err.response?.status === 500) {
                const errorMsg = err.response?.data?.error || '서버 내부 오류가 발생했습니다.';
                setError(`서버 오류 (500): ${errorMsg}`);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError(`네트워크 오류: ${err.message || '서버와 통신할 수 없습니다.'}`);
            }
        }
        setLoading(false);
    };

    const handleCancelEnrollment = async (enrollmentId) => {
        if (!window.confirm('정말로 수강신청을 취소하시겠습니까?')) {
            return;
        }

        setCancellingId(enrollmentId);
        try {
            const res = await axios.delete(`/api/courses/${enrollmentId}`, {
                withCredentials: true
            });

            if (res.data && res.data.success) {
                alert(res.data.message || '수강신청이 취소되었습니다.');
                // 목록 새로고침
                await fetchConfirmedCourses();
            } else if (res.data && res.data.error) {
                alert(res.data.error);
            } else {
                alert('수강신청 취소에 실패했습니다.');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                alert('로그인이 필요합니다. 다시 로그인해주세요.');
            } else if (err.response?.status === 403) {
                alert('권한이 없습니다.');
            } else if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert('서버 오류로 수강신청 취소에 실패했습니다.');
            }
        }
        setCancellingId(null);
    };

    useEffect(() => {
        fetchConfirmedCourses();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>수강신청 과목 목록</h2>
            {loading && <p>로딩 중...</p>}
            {error && <p style={{color:'red', whiteSpace: 'pre-line'}}>{error}</p>}
            {!loading && !error && (
                <>
                    <div style={{ marginBottom: '10px' }}>
                        <button onClick={fetchConfirmedCourses} disabled={loading}>
                            새로고침
                        </button>
                    </div>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '10px' }}>과목ID</th>
                            <th style={{ padding: '10px' }}>과목명</th>
                            <th style={{ padding: '10px' }}>교수명</th>
                            <th style={{ padding: '10px' }}>신청 취소</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>
                                    수강 신청된 과목이 없습니다.
                                </td>
                            </tr>
                        )}
                        {courses.map(course => (
                            <tr key={course.enrollmentId}>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    {course.subjectId}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {course.subjectName}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {course.professorName}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleCancelEnrollment(course.enrollmentId)}
                                        disabled={cancellingId === course.enrollmentId}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '3px',
                                            cursor: cancellingId === course.enrollmentId ? 'not-allowed' : 'pointer',
                                            opacity: cancellingId === course.enrollmentId ? 0.6 : 1
                                        }}
                                    >
                                        {cancellingId === course.enrollmentId ? '취소 중...' : '취소'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {courses.length > 0 && (
                        <p style={{ marginTop: '10px', color: '#666' }}>
                            총 {courses.length}개의 과목이 수강신청되었습니다.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default ConfirmedCourses;
import React, { useState, useEffect } from "react";
import axios from "axios";

// 인원 초과 알림
function ms_Studendexceed() {
    window.alert("수강 인원이 초과되었습니다. 다른 과목을 선택하세요.");
}

// 수강신청 완료 알림
function ms_ConfirmRegisterSubject() {
    window.alert("수강신청이 완료되었습니다.");
}

// 최대 수강 인원 체크 함수 (수강 인원 >= 최대 인원수면 true)
function MAX_STU(currentCount, maxCount) {
    return currentCount >= maxCount;
}

// 중복 신청 확인 함수 (이미 신청한 과목인지)
function same_subject(enrollments, subjectId) {
    return enrollments.some(e => e.subject_id === subjectId);
}

// 학생의 수강신청 내역+과목조회
// 반환: [{ subject_id, subject_name, professor_name, department_name, current_count, max_count, ... }]
async function search_subID_StudentID_list(studentId, filterType = "", filterValue = "") {
    // 서버에서는 studentId별 신청내역과 과목목록, 검색필터(학과/강의명) 지원
    let url = `http://localhost:8080/api/student/${studentId}/course-registration-list`;
    if (filterType && filterValue) {
        url += `?filterType=${filterType}&filterValue=${encodeURIComponent(filterValue)}`;
    }
    const res = await axios.get(url, { withCredentials: true });
    return res.data; // { subjects: [ ... ], enrollments: [ ... ] }
}

export default function CourseRegistration({ studentId }) {
    const [subjectList, setSubjectList] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState("major");
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/api/student/${studentId}/course-registration-list`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('수강신청 데이터를 불러오지 못했습니다.');
                setLoading(false);
            });
    }, [studentId]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    // 과목+신청내역 조회
    const fetchSubjectsAndEnrollments = async (filterType = "", filterValue = "") => {
        setLoading(true);
        try {
            const data = await search_subID_StudentID_list(studentId, filterType, filterValue);
            setSubjectList(data.subjects || []);
            setEnrollments(data.enrollments || []);
        } catch (e) {
            window.alert("수강신청 데이터를 불러오지 못했습니다.");
            setSubjectList([]);
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    // 검색 버튼 클릭
    const handleSearch = () => {
        fetchSubjectsAndEnrollments(searchType, searchValue.trim());
    };

    // 수강신청 버튼 클릭
    const handleRegister = async subject => {
        // 중복 신청 체크
        if (same_subject(enrollments, subject.subject_id)) {
            window.alert("이미 신청한 과목입니다.");
            return;
        }
        // 인원 초과 체크
        if (MAX_STU(subject.current_count, subject.max_count)) {
            ms_Studendexceed();
            return;
        }
        // 수강신청 요청
        try {
            await axios.post(
                "http://localhost:8080/api/student/course-registration",
                {
                    student_id: studentId,
                    subject_id: subject.subject_id
                },
                { withCredentials: true }
            );
            ms_ConfirmRegisterSubject();
            // 최신 데이터로 갱신
            fetchSubjectsAndEnrollments(searchType, searchValue.trim());
        } catch (e) {
            window.alert("수강신청에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>수강신청</h2>
            <div style={{ marginBottom: 16 }}>
                <select
                    value={searchType}
                    onChange={e => setSearchType(e.target.value)}
                    style={{ marginRight: 8 }}
                >
                    <option value="major">학과로 검색</option>
                    <option value="subject">과목명으로 검색</option>
                </select>
                <input
                    placeholder={searchType === "major" ? "학과명 입력" : "과목명 입력"}
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <table border={1} cellPadding={8} style={{ minWidth: 800 }}>
                    <thead>
                    <tr>
                        <th>과목ID</th>
                        <th>과목명</th>
                        <th>교수명</th>
                        <th>학과</th>
                        <th>현재 인원</th>
                        <th>최대 인원</th>
                        <th>신청</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subjectList.map(subject => (
                        <tr key={subject.subject_id}>
                            <td>{subject.subject_id}</td>
                            <td>{subject.subject_name}</td>
                            <td>{subject.professor_name}</td>
                            <td>{subject.department_name}</td>
                            <td>{subject.current_count}</td>
                            <td>{subject.max_count}</td>
                            <td>
                                {same_subject(enrollments, subject.subject_id) ? (
                                    <span>신청됨</span>
                                ) : MAX_STU(subject.current_count, subject.max_count) ? (
                                    <span style={{ color: "red" }}>마감</span>
                                ) : (
                                    <button onClick={() => handleRegister(subject)}>
                                        신청
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
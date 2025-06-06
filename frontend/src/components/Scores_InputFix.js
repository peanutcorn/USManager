import React, { useState, useEffect } from "react";
import axios from "axios";

// 성적 입력기간 체크(예시: 2025-06-06 ~ 2025-07-07)
function grade_input_time() {
    const now = new Date();
    const start = new Date("2025-06-06T00:00:00");
    const end = new Date("2025-07-07T23:59:59");
    return now >= start && now <= end;
}

// 유효성 검사 함수
function validation_grades(scores) {
    return scores.every(s => {
        const score = parseFloat(s.score);
        return (
            !isNaN(score) && score >= 0 && score <= 100 &&
            s.grade && s.avg !== ""
        );
    });
}

function Null_Calcul(scores) {
    return scores.map(s => ({
        ...s,
        score: s.score === "" || s.score == null ? "0" : s.score,
        grade: s.grade === "" || s.grade == null ? "F" : s.grade,
        avg: s.avg === "" || s.avg == null ? "0" : s.avg,
    }));
}

function ms_save() {
    window.alert("성적이 저장되었습니다.");
}
function ms_no_time_Scoresinput() {
    window.alert("성적 입력기간이 아닙니다.");
    window.location.replace("/professor-main");
}
function ms_no_vaildation_grades() {
    window.alert("성적 총합이 0~100점이 되게 입력해주세요.");
}
function ms_no_input_grade() {
    window.alert("등급을 설정하지 않았습니다");
}

export default function Scores_InputFix() {
    const [searchType, setSearchType] = useState("subject");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [scores, setScores] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [loading, setLoading] = useState(false);

    // 성적 입력 기간 체크
    useEffect(() => {
        if (!grade_input_time()) ms_no_time_Scoresinput();
    }, []);

    // CORS 및 인증 세션 포함 설정
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true, // JSESSIONID 등 세션 쿠키 허용
        headers: {
            "Content-Type": "application/json"
        }
    });

    // 조회 (과목명/학생명)
    const handleSearch = async () => {
        setIsFetched(false);
        setLoading(true);
        try {
            let res;
            if (searchType === "subject") {
                res = await axiosInstance.get(
                    `/enrollments/by-subject-name`,
                    { params: { subject_name: query.trim() } }
                );
            } else {
                res = await axiosInstance.get(
                    `/enrollments/by-student-name`,
                    { params: { student_name: query.trim() } }
                );
            }
            const data = res.data || [];
            setResults(data);
            setScores(
                data.map(e => ({
                    enrollment_id: e.enrollment_id,
                    student_id: e.student_id,
                    student_name: e.student_name,
                    student_year: e.student_year,
                    subject_id: e.subject_id,
                    subject_name: e.subject_name,
                    grade: e.grade || "",
                    score: e.score || "",
                    avg: e.avg || ""
                }))
            );
        } catch (e) {
            if (e.response && e.response.status === 401) {
                window.alert("로그인이 필요합니다. 다시 로그인해 주세요.");
            } else if (e.response && e.response.status === 403) {
                window.alert("접근 권한이 없습니다. 관리자에게 문의하세요.");
            } else {
                window.alert("검색 오류가 발생했습니다.");
            }
            setResults([]);
            setScores([]);
        } finally {
            setIsFetched(true);
            setLoading(false);
        }
    };

    const handleInputChange = (idx, field, value) => {
        setScores(prev =>
            prev.map((s, i) =>
                i === idx ? { ...s, [field]: value } : s
            )
        );
    };

    // 성적 저장
    const handleSave = async () => {
        let scoresT = Null_Calcul(scores);
        if (!scoresT.every(s => s.grade && s.score)) {
            ms_no_input_grade();
            return;
        }
        if (!validation_grades(scoresT)) {
            ms_no_vaildation_grades();
            return;
        }
        try {
            await axiosInstance.post(
                `/grades/fix`,
                { scores: scoresT }
            );
            ms_save();
        } catch (e) {
            if (e.response && e.response.status === 403) {
                window.alert("권한이 없습니다. 로그인 상태와 접근 권한을 확인하세요.");
            } else {
                window.alert("성적 저장에 실패했습니다.");
            }
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h2>성적 입력</h2>
            <div style={{ marginBottom: 12 }}>
                <select
                    value={searchType}
                    onChange={e => setSearchType(e.target.value)}
                >
                    <option value="subject">과목명으로 조회</option>
                    <option value="student">학생명으로 조회</option>
                </select>
                <input
                    style={{ marginLeft: 8, marginRight: 8 }}
                    placeholder={searchType === "subject" ? "과목명 입력" : "학생명 입력"}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? "조회 중..." : "조회"}
                </button>
            </div>
            {isFetched && results.length === 0 && (
                <div>검색 결과가 없습니다.</div>
            )}
            {isFetched && results.length > 0 && (
                <table border={1} cellPadding={6} style={{ minWidth: 600 }}>
                    <thead>
                    <tr>
                        <th>과목ID</th>
                        <th>과목명</th>
                        <th>학번</th>
                        <th>이름</th>
                        <th>학년</th>
                        <th>성적(점수)</th>
                        <th>등급(A~F)</th>
                        <th>평점(4.5기준)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scores.map((s, idx) => (
                        <tr key={s.enrollment_id}>
                            <td>{s.subject_id}</td>
                            <td>{s.subject_name}</td>
                            <td>{String(s.student_id).padStart(8, '0')}</td>
                            <td>{s.student_name}</td>
                            <td>{s.student_year}</td>
                            <td>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={s.score}
                                    onChange={e => handleInputChange(idx, "score", e.target.value)}
                                    style={{ width: 60 }}
                                />
                            </td>
                            <td>
                                <select
                                    value={s.grade}
                                    onChange={e => handleInputChange(idx, "grade", e.target.value)}
                                >
                                    <option value="">등급</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="F">F</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="0.1"
                                    min={0}
                                    max={4.5}
                                    value={s.avg}
                                    onChange={e => handleInputChange(idx, "avg", e.target.value)}
                                    style={{ width: 50 }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {isFetched && results.length > 0 && (
                <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button onClick={handleSave}>성적 저장</button>
                </div>
            )}
        </div>
    );
}
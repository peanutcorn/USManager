import React from "react";
import { useNavigate } from "react-router-dom";

export default function Professor_MainUI() {
    const navigate = useNavigate();

    // 로그아웃 핸들러 (세션 정리 및 메인으로 이동)
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (e) { /* 예외 무시, 어차피 이동 */ }
        window.localStorage.clear();
        navigate("/login");
    };

    // 성적 입력/수정 페이지로 이동
    const goToScoresInputFix = () => {
        navigate("/professor/grade-input");
    };

    return (
        <div style={{ padding: 32 }}>
            <h2>교수자 메인 화면</h2>
            <div style={{ margin: "20px 0" }}>
                <button onClick={goToScoresInputFix} style={{ padding: "12px 24px", marginRight: 16 }}>
                    성적 입력/수정
                </button>
                {/* 필요하면 다른 교수자 기능 버튼 추가 */}
            </div>
            <div>
                <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#eee" }}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}
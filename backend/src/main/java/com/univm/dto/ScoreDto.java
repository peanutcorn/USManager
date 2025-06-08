package com.univm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ScoreDto {
    private Integer enrollment_id;
    private Float score;
    private String ranks;

    // Getter & Setter
    public Integer getEnrollment_id() { return enrollment_id; }
    public void setEnrollment_id(Integer enrollment_id) { this.enrollment_id = enrollment_id; }
    public Float getScore() { return score; }
    public void setScore(Float score) { this.score = score; }
    public String getRanks() { return ranks; }
    public void setRanks(String ranks) { this.ranks = ranks; }
}
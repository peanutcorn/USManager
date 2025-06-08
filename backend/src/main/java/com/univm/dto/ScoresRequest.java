package com.univm.dto;

import java.util.List;
import com.univm.dto.ScoreDto;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ScoresRequest {
    private List<ScoreDto> scores;

    public List<ScoreDto> getScores() { return scores; }
    public void setScores(List<ScoreDto> scores) { this.scores = scores; }
}
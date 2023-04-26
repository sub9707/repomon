package com.repomon.rocketdan.domain.repomon.controller;

import com.repomon.rocketdan.common.dto.ResultDto;
import com.repomon.rocketdan.domain.repo.dto.RepomonRequestDto;
import com.repomon.rocketdan.domain.repo.dto.RepomonResponseDto;
import com.repomon.rocketdan.domain.repomon.dto.BattleLogRequestDto;
import com.repomon.rocketdan.domain.repomon.dto.BattleLogResponseDto;
import com.repomon.rocketdan.domain.repomon.dto.RepomonStatusResponseDto;
import com.repomon.rocketdan.domain.repomon.service.RepomonService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/repomon")
public class RepomonController {

    private final RepomonService repomonService;

    @GetMapping("/{repoId}")
    @ApiOperation(value = "레포몬의 정보를 조회합니다.")
    public ResponseEntity<ResultDto<RepomonStatusResponseDto>> getRepomonInfo(@PathVariable("repoId") Long repoId) {
        RepomonStatusResponseDto repomonStatusResponseDto = repomonService.getRepomonInfo(repoId);

        return ResponseEntity.ok().body(ResultDto.of(repomonStatusResponseDto));
    }

    @GetMapping("/{repoId}/match")
    @ApiOperation(value = "레포몬의 전투 상대를 매칭합니다.")
    public ResponseEntity<ResultDto<RepomonStatusResponseDto>> getBattleTarget(@PathVariable("repoId") Long repoId) {
        RepomonStatusResponseDto repomonStatusResponseDto = repomonService.getBattleTarget(repoId);
        return ResponseEntity.ok().body(ResultDto.of(repomonStatusResponseDto));
    }

    @PostMapping("/{repoId}/match")
    public ResponseEntity<ResultDto<BattleLogResponseDto>> createBattleResult(@PathVariable("repoId") Long repoId,
                                                                              BattleLogRequestDto battleLogRequestDto) {

        return ResponseEntity.ok().body(ResultDto.of(new BattleLogResponseDto()));
    }

    @GetMapping("/{repoId}/match/result")
    @ApiOperation(value = "상위 5개의 전투기록을 조회합니다.")
    public ResponseEntity<ResultDto<BattleLogResponseDto>> getBattleLogList(@PathVariable("repoId") Long repoId) {
        BattleLogResponseDto battleLog = repomonService.getBattleLogList(repoId);

        return ResponseEntity.ok().body(ResultDto.of(new BattleLogResponseDto()));
    }

    @PutMapping("/{repoId}")
    public ResponseEntity<ResultDto<RepomonResponseDto>> modifyRepomonStatus(@PathVariable("repoId") Long repoId,
                                                                             RepomonRequestDto repomonRequestDto) {

        return ResponseEntity.ok().body(ResultDto.of(new RepomonResponseDto()));
    }
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  StarIcon,
  ShareIcon,
  ArrowUturnLeftIcon,
  PresentationChartLineIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathIcon,
  HeartIcon as SolidHeartIcon,
} from "@heroicons/react/24/solid";
import DetailRepomon from "@/components/Detail/DetailRepomon";
import ProgressBar from "@/components/Detail/ProgressBar";
import styles from "./page.module.scss";
import DetailAnalysis from "@/components/Detail/DetailAnalysis";
import DetailBattle from "@/components/Detail/DetailBattle";
import {
  BattleRecordType,
  RepoDetailConventionInfoType,
  RepoDetailBattleType,
  RepoDetailResearchType,
  RepoDetailType,
  RepoDetailContributionInfoType,
} from "@/types/repoDetail";
import {
  axiosRequestBattleRanking,
  axiosRequestBattleRecord,
  axiosRequestRepoDetail,
  axiosRequestRepoDetailBattleInfo,
  axiosRequestRepoDetailContribution,
  axiosRequestRepoDetailConvention,
  axiosRequestRepoDetailUpdate,
  axiosRequestSetRepresent,
} from "@/api/repoDetail";
import { axiosRequestRepoDetailResearch } from "@/api/repoDetail";
import { pretreatDate } from "@/app/utils/PretreatDate";
import DatePickerModal from "@/components/Detail/DatePickerModal";
import Modal from "react-modal";
import RenameModal from "@/components/Detail/RenameModal";
import Loading from "@/app/loading";
import DetailConvention from "@/components/Detail/DetailConvention";
import DetailContribution from "@/components/Detail/DetailContribution";
import { languageColor } from "@/styles/colors";
import { customAlert } from "@/app/utils/CustomAlert";
import LoadingSpinner from "@/components/Skeletons/LoadingSpinner";
import ExportModal from "@/components/Detail/ExportModal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Page({ params }: { params: { repoId: string } }) {
  const loginUserId: string | null =
    sessionStorage && sessionStorage.getItem("userId");
  const [repoDetailInfo, setRepoDetailInfo] = useState<RepoDetailType>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isUpdated2, setIsUpdated2] = useState<boolean>(false); // 갱신 버튼
  const [repoDetailResearchInfo, setRepoDetailResearchInfo] =
    useState<RepoDetailResearchType>();
  const [repoDetailBattleInfo, setRepoDetailBattleInfo] =
    useState<RepoDetailBattleType>();
  const [battleRank, setBattleRank] = useState<number>();
  const [battleRecordInfo, setBattleRecordInfo] =
    useState<BattleRecordType[]>();
  const [showPage, setShowPage] = useState<boolean>(false);
  const [statUpdated, setStatUpdated] = useState<boolean>(false);
  const [conventionUpdated, setConventionUpdated] = useState<boolean>(false);
  const [repoDetailConventionInfo, setRepoDetailConventionInfo] =
    useState<RepoDetailConventionInfoType>();
  const [repoDetailContributionInfo, setRepoDetailContributionInfo] =
    useState<RepoDetailContributionInfoType>();
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [isTeam, setIsTeam] = useState<boolean>(false);
  const [conventionLoading, setConventionLoading] = useState<boolean>(false);
  const router = useRouter();
  const lanRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [isUpdated3, setIsUpdated3] = useState<boolean>(false); // 대표 레포 설정

  /** =============================================== useEffect =============================================== */
  /** 레포 기본 정보 불러오기 + 레포몬 닉네임, 기간 업데이트 시 정보 재요청 */
  useEffect(() => {
    requestRepoDetail(
      parseInt(params.repoId, 10),
      parseInt(loginUserId as string, 10)
    );
  }, [isUpdated, isUpdated2, isUpdated3]);

  useEffect(() => {
    requestRepoDetailResearch(parseInt(params.repoId, 10));
    requestRepoDetailContribution(parseInt(params.repoId, 10));
  }, [isUpdated2]);

  /** 배틀 정보 불러오기 + 스탯 변경 시 재요청 */
  useEffect(() => {
    requestRepoDetailBattleInfo(parseInt(params.repoId, 10));
  }, [statUpdated, isUpdated2]);

  /** 컨벤션 정보 불러오기 + 컨벤션 수정 시 재요청 */
  useEffect(() => {
    requestRepoDetailConvention(parseInt(params.repoId, 10));
  }, [conventionUpdated, isUpdated2]);

  /** 레포 정보 불러오기 */
  useEffect(() => {
    requestBattleRanking(parseInt(params.repoId, 10));
    requestBattleRecord(parseInt(params.repoId, 10));
  }, []);

  useEffect(() => {
    if (
      repoDetailInfo &&
      repoDetailResearchInfo &&
      repoDetailBattleInfo &&
      battleRank &&
      battleRecordInfo &&
      repoDetailConventionInfo &&
      repoDetailContributionInfo
    ) {
      setShowPage(true);
      if (
        repoDetailContributionInfo.committers &&
        Object.keys(repoDetailContributionInfo.committers).length > 1
      ) {
        setIsTeam(true);
      }
    }
  }, [
    repoDetailInfo,
    repoDetailResearchInfo,
    repoDetailBattleInfo,
    battleRank,
    battleRecordInfo,
    repoDetailConventionInfo,
    repoDetailContributionInfo,
  ]);

  useEffect(() => {
    if (showPage) {
      Modal.setAppElement("#repo-detail");
    }
  }, [showPage]);

  /** 탭 인덱스 정보 */
  useEffect(() => {
    if (document.referrer !== window.location.href) {
      setTabIndex(1);
      sessionStorage.setItem("tabIndex", "1");
    } else {
      setTabIndex(parseInt(sessionStorage.getItem("tabIndex") as string, 10));
    }
  }, []);

  /** =============================================== Event Hadler =============================================== */
  const onClickTabBtn = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    setTabIndex(parseInt(target.id, 10));
    sessionStorage.setItem("tabIndex", target.id);

    if (window.scrollY < 410) {
      window.scrollTo(0, 410);
    }
  };

  const onClickUpdateBtn = () => {
    if (updateLoading) {
      return;
    }

    requestRepoDetailUpdate(parseInt(params.repoId, 10));
  };

  const onClickBack = () => {
    router.back();
  };

  const onClickRepresentBtn = () => {
    requestSetRepresent(
      parseInt(params.repoId, 10),
      parseInt(loginUserId!, 10)
    );
  };

  const scrollLeft = () => {
    if (lanRef.current) {
      lanRef.current.scrollBy({
        left: -lanRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (lanRef.current) {
      lanRef.current.scrollBy({
        left: lanRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  /** =============================================== Axios =============================================== */
  /** 레포 디테일 기본 정보 */
  const requestRepoDetail = async (repoId: number, userId: number) => {
    try {
      const res = await axiosRequestRepoDetail(repoId, userId);
      setRepoDetailInfo(res.data);
    } catch (err) {}
  };

  /** 레포 디테일 분석 정보 */
  const requestRepoDetailResearch = async (repoId: number) => {
    try {
      const res = await axiosRequestRepoDetailResearch(repoId);
      setRepoDetailResearchInfo(res.data);
    } catch (err) {}
  };

  /** 레포 디테일 배틀 정보 */
  const requestRepoDetailBattleInfo = async (repoId: number) => {
    try {
      const res = await axiosRequestRepoDetailBattleInfo(repoId);
      setRepoDetailBattleInfo(res.data.data);
    } catch (err) {}
  };

  /** 레포 디테일 배틀 랭킹 정보 */
  const requestBattleRanking = async (repoId: number) => {
    try {
      const res = await axiosRequestBattleRanking(repoId);
      setBattleRank(res.data.rank);
    } catch (err) {}
  };

  /** 레포 디테일 배틀 전적 정보 */
  const requestBattleRecord = async (repoId: number) => {
    try {
      const res = await axiosRequestBattleRecord(repoId);
      setBattleRecordInfo(res.data.data.battleLogList);
    } catch (err: any) {
      if (err.response.data.status === 404) {
        setBattleRecordInfo([]);
      }
    }
  };

  /** 레포 디테일 컨벤션 정보 */
  const requestRepoDetailConvention = async (repoId: number) => {
    setConventionLoading(true);
    try {
      const res = await axiosRequestRepoDetailConvention(repoId);

      setRepoDetailConventionInfo(res.data);
    } catch (err) {
    } finally {
      setConventionLoading(false);
    }
  };

  /** 레포 디테일 기여도 정보 */
  const requestRepoDetailContribution = async (repoId: number) => {
    try {
      const res = await axiosRequestRepoDetailContribution(repoId);
      setRepoDetailContributionInfo(res.data);
    } catch (err) {}
  };

  /** 레포 갱신 */
  const requestRepoDetailUpdate = async (repoId: number) => {
    try {
      setUpdateLoading(true);
      const res = await axiosRequestRepoDetailUpdate(repoId);

      setIsUpdated2(!isUpdated2);
    } catch (err) {
      customAlert("잠시후 다시 시도해주세요.");
    } finally {
      setUpdateLoading(false);
    }
  };

  /** 대표 레포지토리 설정 */
  const requestSetRepresent = async (repoId: number, userId: number) => {
    if (repoDetailInfo?.myPresentRepo) {
      customAlert("이미 대표로 등록된 레포지토리입니다.");
      return;
    }

    try {
      const res = await axiosRequestSetRepresent(repoId, userId);
      customAlert("대표 레포지토리로 설정되었습니다.");
      setIsUpdated3(!isUpdated3);
    } catch (err) {}
  };

  return (
    <div id="repo-detail">
      {!showPage && <Loading />}
      {repoDetailInfo && showPage && (
        <div className={styles.pageContainer}>
          <div className={styles["top-btn-div"]}>
            <button onClick={onClickBack}>
              <ArrowUturnLeftIcon style={{ width: "12px" }} />
              뒤로가기
            </button>
            {repoDetailInfo.myRepo && (
              <button onClick={onClickRepresentBtn}>
                {repoDetailInfo.myPresentRepo && (
                  <SolidHeartIcon className={styles["color-heart"]} />
                )}
                {!repoDetailInfo.myPresentRepo && <HeartIcon />}
                대표 레포지토리 설정
              </button>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles["repo-mon-card-div"]}>
              <div className={styles["repo-mon-card"]}>
                <DetailRepomon
                  repomonUrl={repoDetailInfo.repomonUrl}
                  repomonTier={
                    repoDetailBattleInfo?.repomon.repomonTier as number
                  }
                />
                <div className={styles["repo-mon-info"]}>
                  <p>
                    <span className={styles.lv}>
                      LV{" "}
                      <span style={{ fontStyle: "normal" }}>
                        {Math.floor(repoDetailInfo.repoExp / 100) + 1}
                      </span>
                    </span>
                    <p className={styles["repo-mon-name"]}>
                      {repoDetailInfo.repomonName}
                      {repoDetailInfo.myRepo && (
                        <RenameModal
                          repoId={params.repoId}
                          setIsUpdated={setIsUpdated}
                        />
                      )}
                    </p>
                  </p>
                  <ProgressBar restExp={repoDetailInfo.repoExp % 100} />
                </div>
              </div>
            </div>
            <div className={styles["default-info-div"]}>
              <div className={styles.first}>
                <p className={styles.title}>
                  {repoDetailInfo.repoName}
                  <ArrowPathIcon />
                </p>
                <div className={styles["icon-div"]}>
                  <span className={styles.star}>
                    <StarIcon />
                    {repoDetailInfo.starCnt}
                  </span>
                  <span className={styles.share}>
                    <ShareIcon />
                    {repoDetailInfo.forkCnt}
                  </span>
                  <span className={styles.github}>
                    <Link
                      href={`https://github.com/${repoDetailConventionInfo?.repoOwner.toLowerCase()}/${
                        repoDetailInfo.repoName
                      }`}
                      target="_blank"
                    >
                      <Image
                        src="/static/images/github.png"
                        alt="logo"
                        width={24}
                        height={24}
                      />
                    </Link>
                  </span>
                </div>
              </div>
              <div className={styles["btn-div"]}>
                <button onClick={onClickUpdateBtn} className={styles.update}>
                  {updateLoading ? (
                    <LoadingSpinner ml={4} mr={4} size={4} />
                  ) : (
                    <span>레포지토리 갱신</span>
                  )}
                </button>
                {loginUserId && repoDetailInfo.myRepo && (
                  <ExportModal
                    repoId={parseInt(params.repoId, 10)}
                    userId={parseInt(loginUserId, 10)}
                    isTeam={isTeam}
                    lans={repoDetailInfo.languages}
                  />
                )}
              </div>
              <p className={styles.date}>
                <span>{pretreatDate(repoDetailInfo.repoStart)}</span>
                <span style={{ margin: "0 0.5rem" }}>~</span>
                {repoDetailInfo.repoEnd && (
                  <span> {pretreatDate(repoDetailInfo.repoEnd)}</span>
                )}
                {!repoDetailInfo.repoEnd && repoDetailInfo.myRepo && (
                  <span className={styles.end}>
                    프로젝트 기간을 설정해주세요.
                  </span>
                )}
                {repoDetailInfo.myRepo && (
                  <DatePickerModal
                    repoId={params.repoId}
                    setIsUpdated={setIsUpdated}
                  />
                )}
              </p>
              <div className={styles["lan-div-container"]}>
                <button
                  className={styles["scroll-btn-left"]}
                  onClick={scrollLeft}
                >
                  &lt;
                </button>
                <div className={styles["lan-div"]} ref={lanRef}>
                  {repoDetailInfo.languages &&
                    repoDetailInfo.languages.map((lan, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: languageColor[lan].color
                            ? (languageColor[lan].color as string)
                            : "gray",
                        }}
                      >
                        {lan}
                      </span>
                    ))}
                </div>
                <button
                  className={styles["scroll-btn-right"]}
                  onClick={scrollRight}
                >
                  &gt;
                </button>
              </div>
              <p className={styles.des}>
                {repoDetailInfo.repoDescription ? (
                  repoDetailInfo.repoDescription
                ) : (
                  <span style={{ color: "gray" }}>프로젝트 설명이 없어요.</span>
                )}
              </p>
              <div className={styles.tab}>
                <button
                  id="1"
                  onClick={onClickTabBtn}
                  className={tabIndex === 1 ? styles.selected : ""}
                >
                  <PresentationChartLineIcon id="1" onClick={onClickTabBtn} />
                  성장
                </button>

                <button
                  id="3"
                  onClick={onClickTabBtn}
                  className={tabIndex === 3 ? styles.selected : ""}
                >
                  <ClipboardDocumentListIcon id="3" onClick={onClickTabBtn} />
                  컨벤션
                </button>
                <button
                  id="4"
                  onClick={onClickTabBtn}
                  className={tabIndex === 4 ? styles.selected : ""}
                >
                  <ChartPieIcon id="4" onClick={onClickTabBtn} />
                  기여도
                </button>
                <button
                  id="2"
                  onClick={onClickTabBtn}
                  className={tabIndex === 2 ? styles.selected : ""}
                >
                  <p id="2" className={styles.vs} onClick={onClickTabBtn}>
                    VS
                  </p>
                  배틀
                </button>
              </div>
            </div>
          </div>
          <div className={styles["tab-content"]} ref={tabRef}>
            {tabIndex === 1 && (
              <DetailAnalysis researchInfo={repoDetailResearchInfo} />
            )}
            {tabIndex === 2 && (
              <DetailBattle
                battleInfo={repoDetailBattleInfo!}
                rank={battleRank!}
                battleRecords={battleRecordInfo!}
                myRepomonNickname={repoDetailInfo.repomonName}
                repoId={params.repoId}
                setStatUpdated={setStatUpdated}
                myRepo={repoDetailInfo.myRepo}
              />
            )}
            {tabIndex === 3 && (
              <DetailConvention
                conventionInfo={repoDetailConventionInfo!}
                setConventionUpdated={setConventionUpdated}
                repoId={params.repoId}
                myRepo={repoDetailInfo.myRepo}
                loading={conventionLoading}
              />
            )}
            {tabIndex === 4 && (
              <DetailContribution
                contributionInfo={repoDetailContributionInfo!}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;

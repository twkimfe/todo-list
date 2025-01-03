// src/js/utils/ddayUtils.js

export const calculateDday = (targetDate) => {
  // 날짜 비교를 위해 시간을 제외한 날짜만 고려
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
  const todayDate = new Date(todayStr);

  // targetDate는 이미 YYYY-MM-DD 형식이므로 바로 Date 객체로 변환
  const ddayDate = new Date(targetDate);
  // 시간 명시 지정

  const diffTime = today - ddayDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // CSS class 결정
  let cssClass = "";
  if (diffDays > 0) {
    cssClass = "dday-passed";
  } else if (diffDays <= -10) {
    cssClass = "dday-future";
  } else {
    cssClass = "dday-near";
  }

  // D-day 텍스트 포맷
  let ddayText;
  if (diffDays > 0) {
    ddayText = Math.abs(diffDays) >= 100 ? `D+Nday` : `D+${diffDays}day`;
  } else {
    ddayText = Math.abs(diffDays) >= 100 ? `D-Nday` : `D${diffDays}day`;
  }

  return {
    text: ddayText,
    cssClass: cssClass,
  };
};

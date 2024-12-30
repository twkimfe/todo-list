// src/js/utils/statusUtils.js
// status 텍스트와 아이콘을 관리하는 함수

export const getStatusDisplay = (status, type = "text") => {
  const statusMap = {
    pending: {
      text: "미진행",
      icon: '<i class="fas fa-hourglass pending-icon"></i>',
    },
    "in-progress": {
      text: "진행중",
      icon: '<i class="fas fa-spinner in-progress-icon"></i>',
    },
    completed: {
      text: "완료",
      icon: '<i class="fas fa-check-circle completed-icon"></i>',
    },
  };

  return type === "text" ? statusMap[status].text : statusMap[status].icon;
};

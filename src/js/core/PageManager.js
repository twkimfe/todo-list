// src/js/core/PageManager.js
class PageManager {
  constructor() {
    this.pages = new Map();
    this.currentPage = null;
  }

  addPage(path, pageInstance) {
    this.pages.set(path, pageInstance);
  }

  async switchToPage(path, container) {
    // 현재 페이지 정리
    if (this.currentPage) {
      this.currentPage.unmount();
    }

    // 새 페이지 가져오기
    const nextPage = this.pages.get(path);
    if (!nextPage) {
      throw new Error(`No page found for path: ${path}`);
    }

    // 새 페이지 마운트
    this.currentPage = nextPage;
    await nextPage.mount(container);
  }
}

export default new PageManager();

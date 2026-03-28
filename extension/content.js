// 페이지에 확장 프로그램 존재를 알림
document.documentElement.setAttribute('soopzzk-ext', 'true');

// 페이지 → 확장 프로그램: 치지직 채널 정보 요청
window.addEventListener('message', async (e) => {
  if (e.source !== window) return;

  if (e.data?.type === 'soopzzk-fetch-chzzk') {
    const channelId = e.data.channelId;
    const response = await chrome.runtime.sendMessage({
      type: 'fetchChzzkChannel',
      channelId,
    });
    // 확장 프로그램 → 페이지: 결과 전달
    window.postMessage({
      type: 'soopzzk-chzzk-result',
      channelId,
      name: response?.name || null,
    }, '*');
  }
});

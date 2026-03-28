const COOKIES = [
  {
    name: "NID_AUT",
    domain: ".naver.com",
    url: "https://nid.naver.com/nidlogin.login",
  },
  {
    name: "NID_SES",
    domain: ".naver.com",
    url: "https://nid.naver.com/nidlogin.login",
  },
  {
    name: "AuthTicket",
    domain: ".sooplive.com",
    url: "https://login.sooplive.com/app/LoginAction.php",
  },
  {
    name: "UserTicket",
    domain: ".sooplive.com",
    url: "https://login.sooplive.com/app/LoginAction.php",
  },
  {
    name: "isBbs",
    domain: ".sooplive.com",
    url: "https://login.sooplive.com/app/LoginAction.php",
  },
];

// 지원하는 사이트 목록
const SITES = [
  { topLevelSite: "https://ruby747.github.io" },
  { topLevelSite: "https://www.ruby747.com" },
];

const init = async () => {
  for (const { name, url } of COOKIES) {
    const cookie = await chrome.cookies.get({ name, url });
    if (cookie != null) {
      for (const partitionKey of SITES) {
        await setPartitionedCookie(cookie, url, partitionKey);
      }
    }
  }
};

const setPartitionedCookie = async (cookie, url, partitionKey) => {
  if (cookie.partitionKey != null) {
    return;
  }
  const { hostOnly, session, ...rest } = cookie;
  await chrome.cookies.set({
    ...rest,
    sameSite: chrome.cookies.SameSiteStatus.NO_RESTRICTION,
    secure: true,
    url,
    partitionKey,
  });
};

// 확장 프로그램 설치/시작 시 쿠키 복사
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

// 로그인/로그아웃 시 실시간 쿠키 동기화
chrome.cookies.onChanged.addListener(async ({ cookie, removed }) => {
  if (removed) return;
  const c = COOKIES.find(
    ({ name, domain }) => cookie.name === name && cookie.domain === domain
  );
  if (c != null) {
    for (const partitionKey of SITES) {
      await setPartitionedCookie(cookie, c.url, partitionKey);
    }
  }
});

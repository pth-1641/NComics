export const smoothScroll = (to: number, direct: 'top' | 'bottom' = 'top') => {
  let i = document.body.scrollHeight;
  const interval = setInterval(() => {
    window.scrollTo(0, i);
    i += direct === 'top' ? -40 : 40;
    console.log(i);
    if (i <= to) clearInterval(interval);
  }, 10);
};

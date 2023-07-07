type Route = {
  name: string;
  path: string;
  icon?: string;
};

export const routes: Route[] = [
  { name: 'Home', path: '/' },
  { name: 'Genres', path: '/genres?type=all' },
  { name: 'New', path: '/new' },
  { name: 'Top', path: '/top?tab=all' },
];

type TopRoute = {
  name: string;
  type: string;
  icon: string;
};

export const topRoutes: TopRoute[] = [
  { name: 'Top Comics', type: 'all', icon: 'fontisto:snowflake-6' },
  { name: 'Top Daily', type: 'daily', icon: 'tabler:hexagon-letter-d' },
  { name: 'Top Weekly', type: 'weekly', icon: 'tabler:hexagon-letter-w' },
  { name: 'Top Monthly', type: 'monthly', icon: 'tabler:hexagon-letter-m' },
  {
    name: 'Top Chapter',
    type: 'chapter',
    icon: 'fluent:document-one-page-multiple-20-regular',
  },
  { name: 'Top Follow', type: 'follow', icon: 'ph:users' },
  { name: 'Top Comment', type: 'comment', icon: 'fluent:comment-20-regular' },
];

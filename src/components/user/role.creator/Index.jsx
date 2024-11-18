import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Skeleton, demoTheme, stringAvatar } from '../../../service/service.component';
import logo from "../../../../public/vite.svg";
import CreatorDashboard from './Dashboard';
import { Avatar } from '@mui/material';
import { sendReq } from '../../../service/service.api';
import { API_SERVER } from '../../../router/router.server';

// Định nghĩa navbar
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Tổng quan',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Stream',
    icon: <CastConnectedIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Báo cáo',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
];

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

export default function CreatorIndex() {
  const router = useDemoRouter('/dashboard');

  const [profile, setProfile] = React.useState({});

  React.useEffect(() => {
    const url_getInfoAcc = API_SERVER.GET_PROFILE;
    const fetcher = async () => {
      const res = await sendReq(url_getInfoAcc, { method: "GET"});
      if(res.ok){
        const dataRes = await res.json();
        setProfile(dataRes);
      }
    }
    fetcher();
  }, []);
  console.log('profile: ', profile)

  const [session, setSession] = React.useState({
    user: {
      name: "Nguyễn Văn Anh",
      email: 'creator@gmail.com',
      image: null
    }
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        if (Object.keys(profile).length === 0) {
          console.error("Profile data is not loaded yet.");
          return;
        }

        setSession({
          user: {
            name: profile.fullname,
            email: profile.username,
            image: profile.avatar
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, [profile]);

  React.useEffect(() => {
    if(profile.id){
      setSession(preSession => ({
        ...preSession,
        user: {
          ...preSession.user,
          name: profile.fullname,
          email: profile.username,
          image: profile.avatar
        }
      }))
    }
  }, [profile]);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src={logo} alt='Logo'/>,
        title: 'Logo'
      }}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
            <CreatorDashboard/>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>
            <Grid size={4}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={8}>
                <Skeleton height={100} />
            </Grid>

            <Grid size={12}>
                <Skeleton height={150} />
            </Grid>
            <Grid size={12}>
                <Skeleton height={14} />
            </Grid>

            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
                <Skeleton height={100} />
            </Grid>
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
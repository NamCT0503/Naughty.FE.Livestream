import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CastConnectedIcon from '@mui/icons-material/CastConnected';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import StreamOverView from "@mui/icons-material/Camera";
import LivestreamIcon from "@mui/icons-material/WifiTethering";
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Skeleton, demoTheme, stringAvatar } from '../../../service/service.component';
import logo from "../../../../public/vite.svg";
import CreatorDashboard from './Dashboard';
import { Avatar, Box } from '@mui/material';
import { sendReq } from '../../../service/service.api';
import { API_SERVER } from '../../../router/router.server';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CreatorStream from './Stream';
import SkeletonJSX from '../../Skeleton';
import Livestream from './Livestream';

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path)),
        window.history.pushState({}, '', path);
      }
    };
  }, [pathname]);

  return router;
}

export default function CreatorIndex() {
  const router = useDemoRouter('/creator/dashboard');

  const [profile, setProfile] = React.useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa navbar
  const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'creator/dashboard',
      title: 'Tổng quan',
      icon: <DashboardIcon />,
      onclick: () => navigate('/dashboard')
    },
    {
      segment: 'creator/streams',
      title: 'Stream',
      icon: <CastConnectedIcon />,
      children: [
        {
          segment: 'overview',
          title: 'Danh sách Stream của tôi',
          icon: <StreamOverView />,
          onclick: () => navigate('/streams/overview')
        },
        {
          segment: 'live',
          title: 'Livestream',
          icon: <LivestreamIcon />,
          onclick: () => navigate('/streams/live')
        }
      ]
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Analytics',
    },
    {
      segment: 'creator/reports',
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
      navigation={NAVIGATION.map(item => ({
        ...item,
        onclick: item.onclick || null
      }))}
      router={{
        pathname: location.pathname,
        navigate: navigate
      }}
      theme={demoTheme}
      branding={{
        logo: <img src={logo} alt='Logo'/>,
        title: 'Logo'
      }}
    >
      <DashboardLayout>
        <PageContainer>
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path='/dashboard' element={<CreatorDashboard props={profile} />} />
              <Route path='/streams/overview' element={<CreatorStream />} />
              <Route path='/streams/live' element={<Livestream />} />
            </Routes>
          </Box>
          
          {/* Nội dung hiển thị trong quá trình chờ tải trang */}
          {/* <SkeletonJSX/> */}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
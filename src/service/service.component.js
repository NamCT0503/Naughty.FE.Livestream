import { extendTheme, styled } from '@mui/material/styles';

// Tạo khung chờ cho các thành phần chưa tải dữ liệu
export const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

// Bật chế độ tối/sáng và responsive
export const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
});

const stringToHEXCodeColor = (name) => {
    let hash = 0;
    let i;
    let color = "#";

    for(i=0; i<name.length; i++){
        hash = name.charCodeAt(i)+((hash << 5) - hash);
    }

    for(i=0; i<3; i++){
        const value = (hash >> (i*8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export const stringAvatar = (fullname) => {
    const name = fullname.split(' ').slice(-2).toString().replace(',', ' ')

    return{
        sx: {
            bgcolor: stringToHEXCodeColor(name)
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }
}
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Checkbox, FormControlLabel, InputBase, Link, MenuItem, Select, Switch } from "@mui/material";
// import "../../styles/css/signin.css";
import { useState } from "react";
import { customIcon } from "../../styles/icon/icon.jsx";
import { API_SERVER } from "../../router/router.server.js";
import { useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";

const SignupJSX = () => {
    const [errorFullname, setFullname] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const [dataForm, setDataForm] = useState({
        fullname: '',
        username: '',
        password: '',
        role: 'user'
    });

    const navigate = useNavigate();

    const handleChangeData = (e) => {
        e.preventDefault();
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        });
    }

    const handleChooseRole = (e) => {
        e.preventDefault();
        setDataForm({
            ...dataForm,
            role: e.target.value
        });
    }

    const handleSubmit = async () => {
        try {
            const url = API_SERVER.USER_SIGNUP;
            checkDataInput();
            if(errorFullname || errorUsername || errorPassword)
                return alert('Lỗi đăng ký!');

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataForm)
            });

            const dataRes = await res.json();
            if(res.ok){
                alert('Đăng ký thành công!');
                return navigate('/');
            }

            return alert(dataRes.message? dataRes.message: "Đăng ký không thành công!");
        } catch (error) {
            console.log('[SignUp Error]: ', error);
        }
    }

    const checkDataInput = () => {
        if(dataForm.fullname==='' || (dataForm.fullname.length <= 6)){
            setFullname(true);
        } else if(dataForm.fullname.length > 6) setFullname(false)

        if(dataForm.username==='' || dataForm.username.length<=6){
            setErrorUsername(true);
        } else if(dataForm.username.length>6) setErrorUsername(false);

        if(dataForm.password==='' || dataForm.password.length<=6){
            setErrorPassword(true);
        } else if(dataForm.password.length>6) setErrorPassword(false);
    }

    const handleShowOrHidePassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    return(
        <>
        <FormControl className='container-form signin'>
            <h1>Trang đăng ký</h1>
            <TextField 
                className="input-in4 signin"
                id={errorFullname? "outlined-error-helper-text": null}
                name='fullname'
                value={dataForm.fullname}
                onChange={handleChangeData}
                fullWidth 
                label='Họ và tên' 
                placeholder='Nguyễn Văn Anh'
                type='text'
                margin="normal"
                error={errorFullname}
                helperText={
                    errorFullname? "Họ và tên phải nhiều hơn 6 ký tự": null
                }
            />
            <TextField 
                className="input-in4 signin"
                id={errorUsername? "outlined-error-helper-text": null}
                name='username'
                value={dataForm.username}
                onChange={handleChangeData}
                fullWidth 
                label='Tên tài khoản' 
                placeholder='abcXYZ123'
                type='text'
                margin="normal"
                error={errorUsername}
                helperText={
                    errorUsername? "Tên tài khoản phải nhiều hơn 6 ký tự": null
                }
            />
            <div className="area-input-password auth">
                <TextField
                    className="input-in4 signin"
                    id={errorPassword? "outlined-error-helper-text password-input": "password-input"}
                    name="password"
                    value={dataForm.password}
                    onChange={handleChangeData}
                    fullWidth
                    label='Mật khẩu'
                    placeholder="******"
                    type={ isShowPassword? 'text': 'password'}
                    error={errorPassword}
                    helperText={errorPassword? "Mật khẩu phải nhiều hơn 6 ký tự": null}
                />
                <Icon baseClassName="fas" onClick={handleShowOrHidePassword} className={isShowPassword? 'fa-solid fa-eye': 'fa-solid fa-eye-slash'} fontSize="small" />
            </div>
            <Select
                value={dataForm.role}
                onChange={handleChooseRole}
            >
                <MenuItem disabled value=""><em>Loại tài khoản</em></MenuItem>
                <MenuItem value='user'>Người dùng</MenuItem>
                <MenuItem value='creator'>Nhà sáng tạo</MenuItem>
            </Select>
            <Button variant="contained" className="btn-signin" onClick={handleSubmit}>Đăng ký</Button>
            <div className="quick-signup">
                <div>Bạn đã có tài khoản?&nbsp;</div>
                <Link href="/" underline="none" id="quick-signup">Đăng nhập ngay</Link>
            </div>
            <div className="before-after">
                <p>Hoặc</p>
            </div>
            <Button 
                className="btn-signin options" 
                variant="contained"
                startIcon={customIcon.google_logo}
            >
                Đăng ký với Google
            </Button>
            <Button 
                className="btn-signin options" 
                variant="contained" 
                startIcon={ customIcon.facebook_logo}
            >
                Đăng ký với Facebook
            </Button>
        </FormControl>
        </>
    )
}

export default SignupJSX;
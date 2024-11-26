import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Checkbox, FormControlLabel, Icon, Link, MenuItem, Select, Switch } from "@mui/material";
import "../../styles/css/signin.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import { customIcon } from "../../styles/icon/icon.jsx";
import { API_SERVER } from "../../router/router.server.js";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

const SigninJSX = () => {
    const [isRoleAdmin, setIsRoleAdmin] = useState(true);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const [dataForm, setDataForm] = useState({
        email: '',
        password: '',
        username: ''
    });

    const navigate = useNavigate();

    const handelUrl = () => {
        if(isRoleAdmin){
            return API_SERVER.ADMIN_SIGNIN;
        }
        return API_SERVER.USER_SIGNIN;
    }

    const handleChangeData = (e) => {
        e.preventDefault();
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = handelUrl();
            // checkDataInput();
            // if(
            //     (errorEmail || errorPassword) &&
            //     (errorUsername || errorPassword)
            // )
            //     return alert('Lỗi đăng nhập!');

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataForm)
            });

            const dataRes = await res.json();
            if(res.ok){
                const role = dataRes.payload.role;
                const sub = dataRes.payload.sub;

                Cookie.set('accessToken', dataRes.accessToken);
                Cookie.set('refreshToken', dataRes.refreshToken);
                Cookie.set('role', role? role: 'admin');
                Cookie.set('sub', sub);
                
                if(role){
                    if(role==='creator') navigate('/creator');
                    if(role==='user') navigate('/user');
                } else navigate('/admin');

                return alert('Đăng nhập thành công!');
            }

            return alert(dataRes.message? dataRes.message: "Đăng nhập không thành công!");
        } catch (error) {
            console.log('[SignIn Error]: ', error);
        }
    }

    const checkDataInput = () => {
        if(isRoleAdmin){
            if(dataForm.email==='' || (dataForm.email.match(/@/g).length !== 1)){
                setErrorEmail(true);
            } else if(dataForm.email.match(/@/g).length === 1) setErrorEmail(false)
        }

        if(!isRoleAdmin){
            if(dataForm.username==='' || dataForm.username.length<=6){
                setErrorUsername(true);
            } else if(dataForm.username.length>6) setErrorUsername(false);
        }

        if(dataForm.password==='' || dataForm.password.length<=6){
            setErrorPassword(true);
        } else if(dataForm.password.length>6) setErrorPassword(false);
    }

    return(
        <>
        <FormControl className='container-form signin'>
            <h1>Trang đăng nhập</h1>
            <TextField 
                className="input-in4 signin"
                id={errorEmail? "outlined-error-helper-text": null}
                name={isRoleAdmin? 'email': 'username'}
                value={isRoleAdmin? dataForm.email: dataForm.username}
                onChange={handleChangeData}
                fullWidth 
                label={isRoleAdmin? 'Email': 'Tên tài khoản'} 
                placeholder={isRoleAdmin? 'your@gmail.com': 'abcXYZ123'}
                type={isRoleAdmin? 'email': 'text'}
                margin="normal"
                error={isRoleAdmin? errorEmail: errorUsername}
                helperText={
                    isRoleAdmin? 
                    errorEmail? "Email không hợp lệ!": null:
                    errorUsername? "Tên tài khoản phải nhiều hơn 6 ký tự": null
                }
            />
            <TextField
                className="input-in4 signin"
                id={errorPassword? "outlined-error-helper-text": null}
                name="password"
                value={dataForm.password}
                onChange={handleChangeData}
                fullWidth
                label='Mật khẩu'
                placeholder="******"
                type="password"
                margin="normal"
                error={errorPassword}
                helperText={errorPassword? "Mật khẩu phải nhiều hơn 6 ký tự": null}
            />
            <div className="area-checkbox-switch">
                <FormControlLabel control={<Switch defaultChecked onChange={() => setIsRoleAdmin(!isRoleAdmin)} />} label="Bạn là Admin" />
                <FormControlLabel control={<Checkbox/>} label='Ghi nhớ đăng nhập' />
            </div>
            <Button variant="contained" className="btn-signin" onClick={handleSubmit}>Đăng nhập</Button>
            <Link underline="none" sx={{ margin: '10px'}} id="forgot-password">Quên mật khẩu?</Link>
            <div className="before-after" style={{ display: isRoleAdmin? 'none': 'flex'}}>
                <p>Hoặc</p>
            </div>
            <Button 
                className="btn-signin options" 
                variant="contained"
                startIcon={customIcon.google_logo}
                sx={{ display: isRoleAdmin? 'none': 'flex'}}
            >
                Đăng nhập với Google
            </Button>
            <Button 
                className="btn-signin options" 
                variant="contained" 
                startIcon={ customIcon.facebook_logo}
                sx={{ display: isRoleAdmin? 'none': 'flex'}}
            >
                Đăng nhập với Facebook
            </Button>
            <div className="quick-signup" style={{ display: isRoleAdmin? 'none': 'flex'}}>
                <div>Bạn chưa có tài khoản?&nbsp;</div>
                <Link href="/signup" underline="none" id="quick-signup">Đăng ký ngay</Link>
            </div>
        </FormControl>
        </>
    )
}

export default SigninJSX;
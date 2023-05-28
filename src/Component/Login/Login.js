import React, {Component} from 'react';
import {
    FormControl, InputLabel, Button, Container, OutlinedInput, InputAdornment, IconButton
} from '@mui/material';
import service from "../../API/Service";
import {connect} from 'react-redux';
import {actLogin, actSaveInfo} from "../../ActionService/Action";
import '../../CSS/login.css';
import ggIcon from '../../Image/gg-icon.svg';
import fbIcon from '../../Image/fb-icon.svg';
import iconLogin from '../../Image/icon-login.png';
import iconRegister from '../../Image/icon-register.png';
import iconForgotPass from '../../Image/icon-forgot-password.png';
import iconChangePass from '../../Image/icon-change-password.png';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import auth from "../../API/AuthService";

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            oldPassword: "",
            fullName: "",
            email: "",
            phone: "",
            isLogin: true,
            isRegister: false,
            isForgotPassword: false,
            showPassword: false,
            showConfirmPassword: false,
            showOldPassword: false,
            code: "",
            sendMailSuccess: false
        };
    }

    async componentDidMount() { //login with gg - fb
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        const username = params.get('username');
        const code = params.get('code')
        if (this.props.isForgot) {
            this.setState({
                isLogin: false,
                isForgotPassWord: true,
                sendMailSuccess: true,
                username: username,
                code: code
            })
        }
        if (token) {
            this.props.onLogin({
                accessToken: token
            });
            let userResult = await service.currentUser()
            const {username, avatar, fullName, email, active} = userResult;
            await this.onLoginComplete({username, avatar, fullName, email, active});
            window.location.href = "/";
        }
    }

    onLoginComplete = async (user) => {
        await this.props.onSaveInfo(user);
        this.props.loginProp({username: user})
    }

    login = async () => { //login with page
        let loginResult = {token: undefined}
        if (this.state.username && this.state.password) {
            try {
                console.log(this.state.username + "------" + this.state.password)
                loginResult = await service.login({
                    username: this.state.username, password: this.state.password,
                })
                this.props.onLogin({
                    accessToken: loginResult.token
                });
                let userResult = await service.currentUser()
                console.log(userResult)
                const {username, avatar, fullName, email, active} = userResult;
                await this.onLoginComplete({username, avatar, fullName, email, active});
                window.location.href = "/";
            } catch (error) {
                alert(error)
            }
        }
    }

    register = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('Password does not match');
            return;
        }
        try {
            let registerResult = await service.register({
                username: this.state.username,
                password: this.state.password,
                fullName: this.state.fullName,
                email: this.state.email,
                phone: this.state.phone
            })
            console.log(registerResult);
            alert("Register Success");
            this.setState({isLogin: true})
        } catch (error) {
            alert(error)
        }
    }

    forgot = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('Password does not match');
            return;
        }
        try {
            let forgotResult = await service.forgot({
                username: this.state.username,
                code: this.state.code,
                newPassword: this.state.password,
            })
            console.log(forgotResult);
            alert("Change PassWord Success");
            this.setState({isLogin: true})
        } catch (error) {
            alert(error)
        }
    }

    change = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert('Password does not match');
            return;
        }
        console.log(auth.getUserInfo().username)
        try {
            let changeResult = await service.change({
                username: auth.getUserInfo().username,
                oldPassword: this.state.oldPassword,
                newPassword: this.state.password,
            })
            console.log(changeResult);
            if (changeResult.status === 200) {
                alert("Change PassWord Success");
                window.location.href = "/"
            }
            this.setState({isLogin: true})
        } catch (error) {
            if (error === 'Invalid username or password!') {
                alert("Mật khẩu cũ chưa đúng!")
            } else {
                alert(error)
            }
        }
    }

    sendMail = async () => {
        if (!this.state.username) {
            alert('Username not null');
            return;
        }
        try {
            let sendMailResult = await service.sendMail({}, this.state.username)
            console.log(sendMailResult);
            alert("Send Mail Success");
            this.setState({sendMailSuccess: true})
        } catch (error) {
            alert(error)
        }
    }

    handleUserName = e => {
        this.setState({username: e.target.value})
    }

    handlePassWord = e => {
        this.setState({password: e.target.value})
    }

    handleConfirmPassWord = e => {
        this.setState({confirmPassword: e.target.value})
    }

    handleOldPassWord = e => {
        this.setState({oldPassword: e.target.value})
    }

    handleFullName = e => {
        this.setState({fullName: e.target.value})
    }

    handleEmail = e => {
        this.setState({email: e.target.value})
    }

    handlePhone = e => {
        this.setState({phone: e.target.value})
    }

    handleCode = e => {
        this.setState({code: e.target.value})
    }

    handleLogin = () => {
        this.setState({
            isLogin: true,
            isRegister: false,
            isForgotPassWord: false
        })
    }

    handleRegister = () => {
        this.setState({
            isLogin: false,
            isRegister: true
        })
    }

    handleForgotPassWord = () => {
        this.setState({
            isLogin: false,
            isForgotPassWord: true
        })
    }

    loginWithGoogle = async () => {
        service.loginWithGoogle();
    }

    loginWithFacebook = async () => {
        service.loginWithFacebook();
    }

    toggleShowPassword() {
        this.setState({showPassword: !this.state.showPassword});
    }

    toggleShowConfirmPassword() {
        this.setState({showConfirmPassword: !this.state.showConfirmPassword});
    }

    toggleShowOldPassword() {
        this.setState({showOldPassword: !this.state.showOldPassword});
    }

    render() {
        return (
            <>
                {!this.props.changepassword ?
                    <>
                        <div className="background">
                        </div>
                        <div className="content">
                            {this.state.isLogin &&
                                <Container maxWidth="sm" className='container-login'>
                                    <div className='form'>
                                        <img src={iconLogin} alt="icon login"/>
                                        <div className="title">Have an account?</div>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Username</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Username"
                                                value={this.state.username}
                                                onChange={(e) => this.handleUserName(e)}
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Password</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Password"
                                                value={this.state.password}
                                                onChange={(e) => this.handlePassWord(e)}
                                                type={this.state.showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => this.toggleShowPassword()}
                                                                    edge="end">
                                                            {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <div onClick={() => this.handleForgotPassWord()}
                                             className='forgot-password-login'>
                                            <p>Forgot your password?</p>
                                        </div>
                                        <Button
                                            className='btn-login'
                                            onClick={() => this.login()}
                                        >
                                            Login</Button>
                                        <div className='register-login1'>
                                            <p>Don't have an account yet?&nbsp;
                                                <span onClick={() => this.handleRegister()}
                                                      className='register-login2'>Register now</span>
                                            </p>
                                        </div>
                                        <div className="auth-login-sso">
                                            <div className="auth-login-sso2">
                                                <div id="login-with-google-button" className="auth-login-with">
                                                    <div onClick={() => this.loginWithGoogle()}>
                                                        <img src={ggIcon} alt="icon gg"></img>
                                                    </div>
                                                </div>
                                                <div id="login-with-facebook-button" className="auth-login-with">
                                                    <div onClick={() => this.loginWithFacebook()}>
                                                        <img src={fbIcon} alt="icon fb"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Container>
                            }
                            {this.state.isRegister &&
                                <Container maxWidth="sm" className='container-login'>
                                    <div className='form'>
                                        <img src={iconRegister} alt="icon login"/>
                                        <div className="title">Register</div>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>FullName</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="FullName"
                                                value={this.state.fullName}
                                                onChange={(e) => this.handleFullName(e)}
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Username</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Username"
                                                value={this.state.username}
                                                onChange={(e) => this.handleUserName(e)}
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Email</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Username"
                                                value={this.state.email}
                                                onChange={(e) => this.handleEmail(e)}
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Phone</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Username"
                                                value={this.state.phone}
                                                onChange={(e) => this.handlePhone(e)}
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Password</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Password"
                                                value={this.state.password}
                                                onChange={(e) => this.handlePassWord(e)}
                                                type={this.state.showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => this.toggleShowPassword()}
                                                                    edge="end">
                                                            {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>ConfirmPassword</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Password"
                                                value={this.state.confirmPassword}
                                                onChange={(e) => this.handleConfirmPassWord(e)}
                                                type={this.state.showConfirmPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => this.toggleShowConfirmPassword()}
                                                                    edge="end">
                                                            {this.state.showConfirmPassword ? <Visibility/> :
                                                                <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <Button
                                            className='btn-login'
                                            onClick={() => this.register()}
                                        >
                                            Register</Button>
                                        <div className='register-login1'>
                                            <p>Already have an account?&nbsp;
                                                <span onClick={() => this.handleLogin()}
                                                      className='register-login2'>Log in</span>
                                            </p>
                                        </div>
                                    </div>
                                </Container>
                            }
                            {this.state.isForgotPassWord &&
                                <Container maxWidth="sm" className='container-login'>
                                    <div className='form'>
                                        <img src={iconForgotPass} alt="icon login"/>
                                        <div className="title">Forgot PassWord</div>
                                        <FormControl className='form-input'>
                                            <InputLabel className='hidden-text'>Username</InputLabel>
                                            <OutlinedInput
                                                className='form-input-2'
                                                label="Username"
                                                value={this.state.username}
                                                onChange={(e) => this.handleUserName(e)}
                                            />
                                        </FormControl>
                                        {this.state.sendMailSuccess &&
                                            <>
                                                <FormControl className='form-input'>
                                                    <InputLabel className='hidden-text'>Code</InputLabel>
                                                    <OutlinedInput
                                                        className='form-input-2'
                                                        label="Username"
                                                        value={this.state.code}
                                                        onChange={(e) => this.handleCode(e)}
                                                    />
                                                </FormControl>
                                                <FormControl className='form-input'>
                                                    <InputLabel className='hidden-text'>Password</InputLabel>
                                                    <OutlinedInput
                                                        className='form-input-2'
                                                        label="Password"
                                                        value={this.state.password}
                                                        onChange={(e) => this.handlePassWord(e)}
                                                        type={this.state.showPassword ? 'text' : 'password'}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => this.toggleShowPassword()}
                                                                            edge="end">
                                                                    {this.state.showPassword ? <Visibility/> :
                                                                        <VisibilityOff/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                                <FormControl className='form-input'>
                                                    <InputLabel className='hidden-text'>ConfirmPassword</InputLabel>
                                                    <OutlinedInput
                                                        className='form-input-2'
                                                        label="Password"
                                                        value={this.state.confirmPassword}
                                                        onChange={(e) => this.handleConfirmPassWord(e)}
                                                        type={this.state.showConfirmPassword ? 'text' : 'password'}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => this.toggleShowConfirmPassword()}
                                                                    edge="end">
                                                                    {this.state.showConfirmPassword ? <Visibility/> :
                                                                        <VisibilityOff/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </>
                                        }
                                        {!this.state.sendMailSuccess &&
                                            <Button
                                                className='btn-login'
                                                onClick={() => this.sendMail()}
                                            >
                                                Continue</Button>
                                        }
                                        {this.state.sendMailSuccess &&
                                            <Button
                                                className='btn-login'
                                                onClick={() => this.forgot()}
                                            >
                                                Confirm</Button>
                                        }
                                    </div>
                                </Container>
                            }
                        </div>
                    </> :
                    <>
                        <div className="content">
                            <Container maxWidth="sm" className='container-login'>
                                <div className='form'>
                                    <img src={iconChangePass} alt="icon login"/>
                                    <FormControl className='form-input'>
                                        <InputLabel className='hidden-text'>Old Password</InputLabel>
                                        <OutlinedInput
                                            className='form-input-2'
                                            label="Password"
                                            value={this.state.oldPassword}
                                            onChange={(e) => this.handleOldPassWord(e)}
                                            type={this.state.showOldPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => this.toggleShowOldPassword()}
                                                                edge="end">
                                                        {this.state.showOldPassword ? <Visibility/> :
                                                            <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl className='form-input'>
                                        <InputLabel className='hidden-text'>New Password</InputLabel>
                                        <OutlinedInput
                                            className='form-input-2'
                                            label="Password"
                                            value={this.state.password}
                                            onChange={(e) => this.handlePassWord(e)}
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => this.toggleShowPassword()}
                                                                edge="end">
                                                        {this.state.showPassword ? <Visibility/> :
                                                            <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl className='form-input'>
                                        <InputLabel className='hidden-text'>ConfirmPassword</InputLabel>
                                        <OutlinedInput
                                            className='form-input-2'
                                            label="Password"
                                            value={this.state.confirmPassword}
                                            onChange={(e) => this.handleConfirmPassWord(e)}
                                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => this.toggleShowConfirmPassword()}
                                                        edge="end">
                                                        {this.state.showConfirmPassword ? <Visibility/> :
                                                            <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <Button
                                            className='btn-login'
                                            onClick={() => this.change()}
                                        >
                                            Confirm</Button>
                                </div>
                            </Container>
                        </div>
                    </>
                }
            </>);
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (data) => {
            dispatch(actLogin(data))
        }, onSaveInfo: (data) => {
            dispatch(actSaveInfo(data))
        },
    }
}

export default connect(null, mapDispatchToProps)(Login)

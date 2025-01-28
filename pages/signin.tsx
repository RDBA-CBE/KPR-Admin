import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';
import { setPageTitle, toggleLocale, toggleRTL } from '../store/themeConfigSlice';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Dropdown from '@/components/Dropdown';
import { useTranslation } from 'react-i18next';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMail from '@/components/Icon/IconMail';
import IconLockDots from '@/components/Icon/IconLockDots';
import IconInstagram from '@/components/Icon/IconInstagram';
import IconFacebookCircle from '@/components/Icon/IconFacebookCircle';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconGoogle from '@/components/Icon/IconGoogle';
import { useMutation } from '@apollo/client';
import axios from 'axios';
import IconX from '@/components/Icon/IconX';
import Swal from 'sweetalert2';
import IconLoader from '@/components/Icon/IconLoader';

const LoginBoxed = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        subscribe: false,
    });

    const [userNameErrorMessage, setuserNameErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });
    const router = useRouter();

    const submitForm = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            // let data = JSON.stringify({
            //     username: 'kprmill',
            //     password: 'yDn3IC1lCuI&)yEFCARssGGg',
            // });

            if (formData?.userName == '') {
                setuserNameErrorMessage('Please enter userName');
            } else {
                setuserNameErrorMessage('');
            }

            if (formData?.password == '') {
                setPasswordErrorMessage('Please enter password');
            } else {
                setPasswordErrorMessage('');
            }

            console.log('formData', formData);
            let data = JSON.stringify({
                username: formData.userName,
                password: formData.password,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://file.kprmilllimited.com/wp-json/jwt-auth/v1/token',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data,
            };

            const response = await axios.request(config);
            localStorage.setItem('kprToken', response.data.token);
            setLoading(false);
            showMessage('Login successfully', 'success');
            router.replace('/');
        } catch (error) {
            console.log('error', error?.response?.data?.message);
            setLoading(false);

            showMessage(error?.response?.data?.message, 'error');
        }
    };

    const showMessage = (msg = '', type = '') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: any) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');

    const { t, i18n } = useTranslation();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-15 backdrop-blur-lg dark:bg-black/50 lg:min-h-[500px]">
                        <div className="absolute end-6 top-6">
                            <div className="dropdown">
                                {flag && (
                                    <Dropdown
                                        offset={[0, 8]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                        button={
                                            <>
                                                <div>
                                                    <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                                </div>
                                                <div className="text-base font-bold uppercase">{flag}</div>
                                                <span className="shrink-0">
                                                    <IconCaretDown />
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            {themeConfig.languageList.map((item: any) => {
                                                return (
                                                    <li key={item.code}>
                                                        <button
                                                            type="button"
                                                            className={`flex w-full rounded-lg hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                            onClick={() => {
                                                                dispatch(toggleLocale(item.code));
                                                                i18n.changeLanguage(item.code);
                                                                setLocale(item.code);
                                                            }}
                                                        >
                                                            <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                                            <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="main-logo flex items-center justify-center mb-5">
                                <img className=" h-[75px] " src="/assets/images/logo.png" alt="logo" />
                            </div>
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-[#642a10] md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your userName and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="userName">User Name</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="userName"
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleChange}
                                            placeholder="Enter User Name"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {userNameErrorMessage && <p className="text-red-500">{userNameErrorMessage}</p>}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {passwordErrorMessage && <p className="text-red-500">{passwordErrorMessage}</p>}
                                </div>

                                <button className="btn  !mt-6 w-full border-0 bg-[#642a10] uppercase text-white">{loading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Sign in'}</button>
                            </form>

                            {/* <div className="text-center dark:text-white mt-5">
                                Don't have an account ?&nbsp;
                                <Link href="/auth/boxed-signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
LoginBoxed.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;

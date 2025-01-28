import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconCaretsDown from '@/components/Icon/IconCaretsDown';
import IconMenuDashboard from '@/components/Icon/Menu/IconMenuDashboard';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMinus from '@/components/Icon/IconMinus';
import IconMenuChat from '@/components/Icon/Menu/IconMenuChat';
import IconMenuMailbox from '@/components/Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '@/components/Icon/Menu/IconMenuTodo';
import IconMenuNotes from '@/components/Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '@/components/Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '@/components/Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '@/components/Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '@/components/Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '@/components/Icon/Menu/IconMenuComponents';
import IconMenuElements from '@/components/Icon/Menu/IconMenuElements';
import IconMenuCharts from '@/components/Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '@/components/Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '@/components/Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '@/components/Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '@/components/Icon/Menu/IconMenuTables';
import IconMenuDatatables from '@/components/Icon/Menu/IconMenuDatatables';
import IconMenuForms from '@/components/Icon/Menu/IconMenuForms';
import IconMenuUsers from '@/components/Icon/Menu/IconMenuUsers';
import IconMenuPages from '@/components/Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '@/components/Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '@/components/Icon/Menu/IconMenuDocumentation';

const Sidebar = () => {
    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('Financial Results');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: any) => state.themeConfig);
    const semidark = useSelector((state: any) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        toggleMenu('Financial Results');
    }, []);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[240px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-center px-4 py-3">
                        <Link href="/financial-result" className="main-logo flex shrink-0 items-center">
                            <img className=" h-[75px] flex-none object-cover" src="/assets/images/logo.png" alt="logo" />
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <Link href="/financial-result" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Financial Results')}</span>
                                            </div>
                                            <div className={'-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </Link>
                                    </li>
                                    {/* <li className="menu nav-item">
                                        <button
                                            type="button"
                                            className={`${currentMenu === 'Financial Results' ? 'active' : ''} nav-link group w-full`}
                                            onClick={() => toggleMenu('Financial Results')}
                                        >
                                            <div className="flex items-center">
                                                <Link href="/annual_reports" className="flex items-center">
                                                    <IconMenuMailbox className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Financial Results')}</span>
                                                </Link>
                                            </div>

                                            <div className={'-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </button> */}

                                    {/* <AnimateHeight duration={300} height={currentMenu === 'Financial Results' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <Link href="/annual_reports">{t('Annual Reports')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_audited-unaudited">{t('Audited / Unaudited Results')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_subsidiary-cos">{t('Financials – Subsidiary Cos')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_uploads">{t('Uploads')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_kpr-profile-downloads">{t('K.P.R.Profile Downloads')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_appointment-of-independent-directors">{t('Appointment of Independent Directors')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_voting-results-of-agm-and-postal-ballot">{t('Voting Results of AGM and Postal Ballot')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_company-information">{t('Company Information')}</Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/financial-result_con-call-invitations-and-transcript">{t('Con-call Invitations and Transcript')}</Link>
                                                    </li>
                                                </ul>
                                            </ul>
                                        </AnimateHeight> */}
                                    {/* </li> */}

                                    <li className="nav-item">
                                        <Link href="/share-holding-pattern" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Share Holding Patterns')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/corporate-governance" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Corporate Governance')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    {/* 
                                    <li className="nav-item">
                                        <Link href="/shipping/shippingprovider" className="group">
                                            <div className="flex items-center">
                                                <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Shipping Providers')}</span>
                                            </div>
                                        </Link>
                                    </li> */}
                                    <li className="nav-item">
                                        <Link href="/policy-info" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Policy / Info')}</span>
                                            </div>
                                            <div className={'-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </Link>
                                    </li>

                                    {/* <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'Policy / Info' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Policy / Info')}>
                                            <div className="flex items-center">
                                                <Link href="policy-info" className="flex items-center">
                                                    <IconMenuMailbox className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Policy / Info')}</span>
                                                </Link>
                                            </div>

                                            <div className={ '-rotate-90 rtl:rotate-90'} onClick={() => toggleMenu('Policy / Info')}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                       
                                    </li> */}
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

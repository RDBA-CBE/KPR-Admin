import React, { useEffect } from 'react';
import axios from 'axios';
import { API, Success, parseHTMLContent, showDeleteAlert, transformData, useSetState } from '@/utils/functions';
import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import Image from 'next/image';
import pdf from '../public/assets/images/pdf.png';
import Swal from 'sweetalert2';
import IconLoader from '@/components/Icon/IconLoader';
import IconEye from '@/components/Icon/IconEye';
import Select from 'react-select';
import Modal from '@/components/Modal';
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import PrivateRouter from '@/components/Layouts/PrivateRouter';

const PolicyInfo = () => {
    const router = useRouter();
    const { path } = router.query;
    const [state, setState] = useSetState({
        data: [],
        parsedData: [],
        page: 1,
        PAGE_SIZES: [10, 20, 30, 50, 100],
        pageSize: 10,
        sidebar: ['Policy', 'Dividend / IEPF', 'Informations', 'Announcements', 'Investor Presentation', 'Stock Exchange Intimations', 'Investor Services'],
        selectedTab: 0,
        loading: false,
        isOpen: false,
        files: [{ subtitle: '', file: null }],
        yearSection: '',
        errorMessage: '',
        name: '',
        yearError: '',
        nameError: '',
        reference: '',
        subject: '',
    });

    useEffect(() => {
        getData();
    }, [state.selectedTab, path]);

    const getData = async () => {
        try {
            // Notiflix.Loading.pulse();
            setState({ loading: true });
            const res = await axios.get('https://file.kprmilllimited.com/wp-json/custom-api/v1/cfdb-submissions');
            const separatedData = res?.data.reduce((acc, obj) => {
                const formPostId = obj.form_post_id;
                if (!acc[formPostId]) {
                    acc[formPostId] = [];
                }
                acc[formPostId].push(obj);
                return acc;
            }, {});

            const tabToFormPostId = {
                0: '3761',
                1: '3699',
                2: '3791',
                3: '3700',
                4: '3788',
                5: '3758',
                6: '3783',
            };

            const formPostId = tabToFormPostId[state.selectedTab];
            const datas = separatedData[formPostId];
            const tableData =
                datas?.map((item) => ({
                    title: item.form_value?.title,
                    link: transformData(item.form_value),
                    id: item?.id,
                    year: item?.form_value?.yearselection[0],
                })) || [];

            setState({ parsedData: tableData, loading: false });
            // Notiflix.Loading.remove();
        } catch (error) {
            setState({ loading: false });
        }
    };

    const assignId = () => {
        const tabToFormPostId = {
            0: '3761',
            1: '3699',
            2: '3791',
            3: '3700',
            4: '3788',
            5: '3758',
            6: '3783',
        };

        return tabToFormPostId[state.selectedTab] || '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ loading: true });
        if (state.name == '') {
            setState({ nameError: 'Please enter title ', loading: false });
            return;
        }
        if (state.yearSection == '') {
            setState({ yearError: 'Please select year ', loading: false });
            return;
        }

        for (const file of state.files) {
            if (!file.file) {
                setState({ errorMessage: 'Please upload a file ', loading: false });
                return;
            } else if (!file.subtitle) {
                setState({ errorMessage: 'Please enter a name ', loading: false });
                return;
            }
        }
        const formData = new FormData();
        const outputArray = state.files.map((item, index) => {
            return {
                [`list${index + 1}`]: item.subtitle,
                [`file-pdf-${index + 1}`]: item.file,
            };
        });

        outputArray.forEach((item) => {
            Object.keys(item).forEach((key) => {
                formData.append(key, item[key]);
            });
        });
        formData.append('title', state.name);
        formData.append('ref', state.reference);
        formData.append('sub', state.subject);
        formData.append('yearselection', state.yearSection.label);
        formData.append('_wpcf7', assignId());
        formData.append('_wpcf7_unit_tag', 'wpcf7-f3650-p3651-o1');

        try {
            const token = localStorage.getItem('kprToken');
            const res: any = await axios.post(`https://file.kprmilllimited.com/wp-json/contact-form-7/v1/contact-forms/${assignId()}/feedback`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setState({ isOpen: false, name: '', yearSection: '', files: [{ subtitle: '', file: null }], loading: false, nameError: '', yearError: '', reference: '', subject: '' });
            getData();
            Success(res?.data?.message);
        } catch (error) {
            setState({ loading: false });
            console.error('Error:', error);
        }
    };

    const handleFileChange = (e, index) => {
        const newFiles = [...state.files];
        const file = e.target.files[0];
        if (file) {
            newFiles[index] = { ...newFiles[index], file };
            setState({ files: newFiles, errorMessage: '' });
        }
    };

    const handleNameChange = (e, index) => {
        const newFiles = [...state.files];
        newFiles[index] = { ...newFiles[index], subtitle: e.target.value };
        setState({ files: newFiles, errorMessage: '' });
    };

    const handleRemove = (index, item) => {
        const newFiles = [...state.files];
        state.files.splice(index, 1);
        setState({ files: state.files });
    };

    const handleAddFile = () => {
        for (const file of state.files) {
            if (!file.file) {
                setState({ errorMessage: 'Please upload a file ' });
                return;
            }
            if (!file.subtitle) {
                setState({ errorMessage: 'Please enter a name ' });
                return;
            }
        }
        setState({
            files: [...state.files, { subtitle: '', file: null }],
            errorMessage: '',
        });
    };

    const yearOptions = [];
    for (let year = 2001; year <= 2026; year++) {
        yearOptions.push({ value: year, label: year.toString() });
    }

    const deleteData = (record) => {
        showDeleteAlert(
            async () => {
                try {
                    const token = localStorage.getItem('kprToken');
                    const config = {
                        method: 'delete',
                        url: `https://file.kprmilllimited.com/wp-json/cf7-api/v1/forms/${assignId()}/submissions/${record.id}`,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    };

                    await axios.request(config);
                    const filteredData = state.parsedData.filter((dataRecord) => dataRecord.id !== record.id);
                    setState({ parsedData: filteredData });
                    getData();

                    Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
                } catch (error) {
                    console.log('error:', error);
                    Swal.fire('Error', 'Failed to delete data.', 'error');
                }
            },
            () => {
                Swal.fire('Cancelled', 'Your data list is safe :)', 'error');
            }
        );
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Policy Information</h5>
                </div>
                <div>
                    <button type="button" className="btn bg-[#642a10] text-white  w-full md:mb-0 md:w-auto" onClick={() => setState({ isOpen: true, update: false, name: '' })}>
                        + Create
                    </button>
                </div>
            </div>
            <div className="mt-5 grid w-full grid-cols-12 gap-3 ">
                <div className="col-span-3 grid ">
                    <div>
                        {state.sidebar?.map((link, index) => (
                            <div
                                key={index}
                                onClick={() => setState({ selectedTab: index })}
                                className={`dark:hover:text-primary-dark border-1 cursor-pointer  border border-gray-300 px-4 py-2 ${
                                    state.selectedTab === index ? 'bg-[#642a10] text-white ' : 'bg-white text-black'
                                }`}
                            >
                                <div className="text-md text-bold cursor-pointer text-sm">{link}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="datatables col-span-9 grid">
                    <div className="datatables col-span-9 grid">
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={state.parsedData}
                            fetching={state.loading}
                            customLoader={<Loader />}
                            columns={[
                                { accessor: 'title', title: 'Title' },
                                { accessor: 'year' },

                                {
                                    accessor: 'link',
                                    title: 'Link',
                                    render: (item: any) =>
                                        item?.link?.map((item) => (
                                            <div className="flex flex-row ">
                                                {item['file-pdf-cfdb7_file']?.endsWith('.mp3') ? (
                                                    <a href={item['file-pdf-cfdb7_file']} target="_blank" rel="noopener noreferrer">
                                                        Concall
                                                    </a>
                                                ) : (
                                                    <a href={item['file-pdf-cfdb7_file']} target="_blank" rel="noopener noreferrer">
                                                        <Image src={pdf} width={30} height={30} alt="Picture of the author" />
                                                        Download
                                                    </a>
                                                )}
                                            </div>
                                        )),
                                },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (row) => (
                                        <>
                                            {/* <Tippy content="Edit">
                                            <button type="button">
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy> */}
                                            <Tippy content="Delete">
                                                <button type="button" onClick={() => deleteData(row)}>
                                                    <IconTrashLines />
                                                </button>
                                            </Tippy>
                                        </>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={state.parsedData?.length}
                            recordsPerPage={state.pageSize}
                            page={state.page}
                            onPageChange={(p) => setState({ page: p })}
                            recordsPerPageOptions={state.PAGE_SIZES}
                            onRecordsPerPageChange={(size) => setState({ pageSize: size })}
                            sortStatus={null}
                            onSortStatusChange={() => {}}
                            selectedRecords={null}
                            onSelectedRecordsChange={(selectedRecords) => {}}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
                <Modal
                    addHeader={`Add`}
                    open={state.isOpen}
                    close={() =>
                        setState({ errorMessage: '', isOpen: false, name: '', nameError: '', yearError: '', yearSection: '', files: [{ subtitle: '', file: null }], reference: '', subject: '' })
                    }
                    renderComponent={() => (
                        <div className=" p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        id="name"
                                        placeholder="Enter Title"
                                        className="form-input mt-1 block w-full"
                                        value={state.name}
                                        onChange={(e) => setState({ name: e.target.value, nameError: '' })}
                                    />
                                    {state.nameError && <div className="mb-2 text-red-500">{state.nameError}</div>}
                                    <div className="mt-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Reference
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            id="name"
                                            placeholder="Enter Reference"
                                            className="form-input mt-1 block w-full"
                                            value={state.reference}
                                            onChange={(e) => setState({ reference: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Subject
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            id="name"
                                            placeholder="Enter Subject"
                                            className="form-input mt-1 block w-full"
                                            value={state.subject}
                                            onChange={(e) => setState({ subject: e.target.value })}
                                        />
                                    </div>
                                    <div className=" mt-3" style={{ width: '100%' }}>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Year <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            placeholder="Select an option"
                                            value={state.yearSection}
                                            onChange={(val) => setState({ yearSection: val, yearError: '' })}
                                            options={yearOptions}
                                            isSearchable={true}
                                        />
                                    </div>
                                    {state.yearError && <div className="mb-2 text-red-500">{state.yearError}</div>}
                                </div>
                                {state.files?.length > 0 && (
                                    <div className="mt-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Files <span className="text-red-500">*</span>
                                        </label>
                                        {state.files.map((item, index) => (
                                            <div key={index} className={`mb-3 flex items-center space-x-2`}>
                                                {item.file ? (
                                                    <div>{item.file.name}</div>
                                                ) : (
                                                    <input
                                                        type="file"
                                                        className="rtl:file-ml-5 form-input p-0 file:border-0 file:bg-[#642a10]  file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-[#642a10] text-white  ltr:file:mr-5"
                                                        accept=""
                                                        onChange={(e) => handleFileChange(e, index)}
                                                    />
                                                )}
                                                <input
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    placeholder="Enter Name"
                                                    className="form-input block w-full"
                                                    value={item.subtitle}
                                                    onChange={(e) => handleNameChange(e, index)}
                                                />
                                                {item.file && (
                                                    <a href={URL.createObjectURL(item.file)} target="_blank" rel="noopener noreferrer">
                                                        <IconEye />
                                                    </a>
                                                )}
                                                {state.files.length > 1 && (
                                                    <button type="button" className="text-red-500" onClick={() => handleRemove(index, item)}>
                                                        <IconTrashLines />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {state.errorMessage && <div className="mb-2 text-red-500">{state.errorMessage}</div>}
                                {state.files?.length < 12 && (
                                    <div className="flex ">
                                        <button type="button" className="btn bg-[#642a10] text-white" onClick={handleAddFile}>
                                            Add File
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button type="submit" className="btn bg-[#642a10] text-white !mt-6">
                                        {state.loading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                />
            </div>
        </>
    );
};
export default PrivateRouter(PolicyInfo);

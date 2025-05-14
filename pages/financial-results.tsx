import React, { useEffect } from 'react';
import axios from 'axios';
import { API, Success, parseHTMLContent, showDeleteAlert, transformData, useSetState } from '@/utils/functions';
import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import IconPdf from '@/components/Icon/IconPdf';
import Image from 'next/image';
import pdf from '../public/assets/images/pdf.png';
import Modal from '@/components/Modal';
import Select from 'react-select';
import IconLoader from '@/components/Icon/IconLoader';
import IconEye from '@/components/Icon/IconEye';
import Swal from 'sweetalert2';
import PrivateRouter from '@/components/Layouts/PrivateRouter';
import Models from '@/src/imports/models.import';
import fs from 'fs';
import IconPlayCircle from '@/components/Icon/IconPlayCircle';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconArrowForward from '@/components/Icon/IconArrowForward';

const FinancialResults = () => {
    const router = useRouter();

    const { menuId } = router.query;

    const [state, setState] = useSetState({
        data: [],
        parsedData: [],
        page: 1,
        PAGE_SIZES: [10, 20, 30, 50, 100],
        pageSize: 10,
        sidebar: [],
        selectedTab: 0,
        loading: false,
        update: false,
        isOpen: false,
        files: [{ subtitle: '', file: null }],
        yearSection: '',
        errorMessage: '',
        name: '',
        yearError: '',
        nameError: '',
        reference: '',
        subject: '',
        selectedMenu: 1,
        tableList: [],
        updateId: '',
        uploadedFiles: [],
        filterYear: '',

        currentPage: 1,
        totalRecords: 0,
        next: null,
        previous: null,
    });

    useEffect(() => {
        getTableList(state.currentPage);
    }, [state.selectedTab, menuId, state.filterYear]);

    useEffect(() => {
        getSubMenu();
    }, [menuId,]);

    const getSubMenu = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.auth.sub_menu(menuId,);
            setState({ 
                sidebar: res?.results, 
                loading: false,
             });
        } catch (error) {
            setState({ loading: false ,});
            

            console.log('✌️error --->', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setState({ submitLoading: true });

            if (state.name == '') {
                setState({ nameError: 'Please enter title ', submitLoading: false });
                return;
            }

            if (state.yearSection == '') {
                setState({ yearError: 'Please select year ', submitLoading: false });
                return;
            }

            for (const file of state.files) {
                if (!file.file) {
                    setState({ errorMessage: 'Please upload a file ', submitLoading: false });
                    return;
                } else if (!file.subtitle) {
                    setState({ errorMessage: 'Please enter a name ', submitLoading: false });
                    return;
                }
            }
            const outputArray = state.files.map((item, index) => {
                return {
                    name: item.subtitle,
                    file: item.file,
                };
            });

            const body = {
                title: state.name,
                year: state.yearSection?.value,
                files: outputArray,
                reference: state.reference,
                subject: state.subject,
                submenu: state.selectedMenu,
            };

            const formData = new FormData();

            formData.append('title', body.title);
            formData.append('submenu', body.submenu);
            formData.append('year', body.year);
            formData.append('reference', body.reference);
            formData.append('subject', body.subject);

            outputArray.forEach((file, index) => {
                formData.append(`files[${index}].file`, file?.file); // Append the file
                formData.append(`files[${index}].name`, file.name); // Append the custom name or default to the file name
            });
            const res = await Models.auth.add_document(formData);
            getTableList(state.currentPage);

            setState({ submitLoading: false, isOpen: false, updateId: '' });
        } catch (error) {
            setState({ submitLoading: false });
            console.error('Error:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setState({ submitLoading: true });
            if (state.name == '') {
                setState({ nameError: 'Please enter title ', submitLoading: false });
                return;
            }

            if (state.yearSection == '') {
                setState({ yearError: 'Please select year ', submitLoading: false });
                return;
            }

            for (const file of state.files) {
                if (!file.file) {
                    setState({ errorMessage: 'Please upload a file ', submitLoading: false });
                    return;
                } else if (!file.subtitle) {
                    setState({ errorMessage: 'Please enter a name ', submitLoading: false });
                    return;
                }
            }

            const withoutId = state.files.filter((item) => item.id === undefined);

            const withId = state.files.filter((item) => item.id !== undefined);

            const unmatched = withId.filter((item1) => {
                const match = state.uploadedFiles.find((item2) => item2?.id === item1?.id);
                return match && item1?.subtitle !== match?.subtitle;
            });

            if (unmatched?.length > 0) {
                unmatched?.map(async (item, index) => {
                    const body = {
                        name: item.subtitle,
                        file: item.file,
                    };
                    const res = await Models.auth.update_document_file(item?.id, body);
                });
            }

            const body = {
                title: state.name,
                year: state.yearSection?.value,
                reference: state.reference,
                subject: state.subject,
                submenu: state.selectedMenu,
            };

            const formData = new FormData();

            formData.append('title', body.title);
            formData.append('submenu', body.submenu);
            formData.append('year', body.year);
            formData.append('reference', body.reference);
            formData.append('subject', body.subject);

            if (withoutId?.length > 0) {
                withoutId?.map(async (item, index) => {
                    const body = {
                        document: state.updateId,
                        name: item.subtitle,
                        file: item.file,
                    };
                    const res = await Models.auth.add_document_file(body);
                    getTableList(state.currentPage);
                });
            }
            const res = await Models.auth.update_document(state.updateId, formData);
            getTableList(state.currentPage);
            setState({
                submitLoading: false,
                isOpen: false,
                updateId: '',
                name: '',
                nameError: '',
                yearError: '',
                yearSection: '',
                files: [{ subtitle: '', file: null }],
                errorMessage: '',
                reference: '',
                subject: '',
            });
        } catch (error) {
            setState({ submitLoading: false });
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

    const handleRemove = async (index, item) => {
        try {
            if (item?.id) {
                await Models.auth.delete_document_files(item?.id);
            }
            state.files.splice(index, 1);
            setState({ files: state.files });
        } catch (error) {
            console.log('✌️error --->', error);
        }
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
    for (let year = 2001; year <= 2030; year++) {
        yearOptions.push({ value: year, label: year.toString() });
    }

    const deleteData = (record) => {
        showDeleteAlert(
            async () => {
                try {
                    const res = await Models.auth.delete_document(record?.id);
                    getTableList(state.currentPage);

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

    const getTableList = async (page) => {
        try {
            setState({ tableLoading: true });
            const body = {
                year: state.filterYear?.value,
            };
            const res: any = await Models.auth.document_list(state.selectedMenu, body,page);
            console.log('✌️res --->', res);
            setState({ 
                tableLoading: false, 
                tableList: res?.results,
                totalRecords: res.count,
                next: res.next,
                previous: res.previous,
                currentPage: page,
             });
        } catch (error) {
            setState({ tableLoading: false });

            console.log('✌️error --->', error);
        }
    };

    const setTableData = async (row) => {
        try {
            const fileData = row?.files?.map((item) => {
                const fileName = item?.file.split('/').pop();

                return {
                    fileUrl: item,
                    id: item?.id,
                    subtitle: item?.name,
                    file: {
                        name: fileName,
                    },
                };
            });

            setState({
                isOpen: true,
                files: fileData,
                updateId: row?.id,
                name: row?.title,
                yearSection: { value: row?.year, label: row?.year },
                reference: row?.reference,
                subject: row?.subject,
                uploadedFiles: fileData,
            });
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const handleNextPage = () => {
        if (state.next) {
            const newPage = state.currentPage + 1;
            getTableList(newPage);
        }
    };

    const handlePreviousPage = () => {
        if (state.previous) {
            const newPage = state.currentPage - 1;
            getTableList(newPage);
        }
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Financial Result</h5>
                </div>
                {/* <Select placeholder="Select Year" value={state.yearSection} onChange={(val) => setState({ yearSection: val, yearError: '' })} options={yearOptions} isSearchable={true} /> */}
                <div>
                    <button
                        type="button"
                        className="btn w-full bg-[#642a10]  text-white md:mb-0 md:w-auto"
                        onClick={() =>
                            setState({
                                isOpen: true,
                                name: '',
                                nameError: '',
                                yearError: '',
                                yearSection: '',
                                files: [{ subtitle: '', file: null }],
                                errorMessage: '',
                                reference: '',
                                subject: '',
                                updateId: '',
                            })
                        }
                    >
                        + Create
                    </button>
                </div>
            </div>
            <div className="z-10 mt-5 grid w-full grid-cols-12 gap-3">
                <div className="z-10 col-span-12 flex justify-end lg:col-span-3 lg:col-start-10">
                    <Select
                        placeholder="Filter by year"
                        value={state.filterYear}
                        onChange={(val) => setState({ filterYear: val, yearError: '' })}
                        options={yearOptions}
                        isSearchable={true}
                        isClearable={true}
                    />
                </div>
            </div>

            <div className="mt-5 grid w-full grid-cols-12 gap-3 ">
                <div className="col-span-3 grid ">
                    <div>
                        {state.sidebar?.map((link, index) => (
                            <div
                                key={index}
                                onClick={() => setState({ selectedTab: index, selectedMenu: link?.id })}
                                className={`dark:hover:text-primary-dark border-1 cursor-pointer  border border-gray-300 px-4 py-2 ${
                                    state.selectedTab === index ? 'bg-[#642a10] text-white' : 'bg-white text-black'
                                }`}
                            >
                                <div className="text-md text-bold cursor-pointer text-sm">{link?.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="datatables col-span-9 grid">
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={state.tableList}
                        fetching={state.tableLoading}
                        customLoader={<Loader />}
                        columns={[
                            { accessor: 'title', title: 'Title' },
                            { accessor: 'year' },

                            {
                                accessor: 'link',
                                title: 'Link',
                                width: 400,
                                render: (item: any) => (
                                    <div className="flex flex-row flex-wrap gap-4">
                                        {item?.files?.map((fileItem: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                {fileItem?.file?.endsWith('.mp3') ? (
                                                    <a href={fileItem?.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                        <IconPlayCircle />
                                                        {fileItem?.name}
                                                    </a>
                                                ) : (
                                                    <a href={fileItem.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                        <Image src={pdf} width={30} height={30} alt="PDF icon" />
                                                        {fileItem?.name}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (row) => (
                                    <>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => setTableData(row)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
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
                        totalRecords={state.tableList?.length}
                        recordsPerPage={state.pageSize}
                        // page={state.page}
                        page={null}
                        onPageChange={(p) => setState({ page: p })}
                        recordsPerPageOptions={state.PAGE_SIZES}
                   
                        onRecordsPerPageChange={(size) => setState({ pageSize: size })}
                        sortStatus={null}
                        onSortStatusChange={() => {}}
                        selectedRecords={null}
                        onSelectedRecordsChange={(selectedRecords) => {}}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${state?.totalRecords} entries`}
                    />
                </div>


            </div>
            <div className="mt-5 flex justify-end gap-3">
                        <button disabled={!state.previous} onClick={handlePreviousPage} className={`btn ${!state.previous ? 'btn-disabled' : 'btn-primary'}`}>
                            <IconArrowBackward />
                        </button>
                        <button disabled={!state.next} onClick={handleNextPage} className={`btn ${!state.next ? 'btn-disabled' : 'btn-primary'}`}>
                            <IconArrowForward />
                        </button>
                    </div>
            <Modal
                addHeader={state.updateId ? 'Update' : `Add`}
                open={state.isOpen}
                close={() =>
                    setState({
                        isOpen: false,
                        name: '',
                        nameError: '',
                        yearError: '',
                        yearSection: '',
                        files: [{ subtitle: '', file: null }],
                        errorMessage: '',
                        reference: '',
                        subject: '',
                        updateId: '',
                    })
                }
                renderComponent={() => (
                    <div className=" p-5">
                        <form onSubmit={state.updateId ? handleUpdate : handleSubmit}>
                            <div className="">
                                <div>
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
                                </div>
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
                                    {state.files?.map((item, index) => (
                                        <div key={index} className={`mb-3 flex items-center space-x-2`}>
                                            {item.file ? (
                                                <div>{item.file.name}</div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    className="rtl:file-ml-5 form-input p-0 text-white file:border-0 file:bg-[#642a10]  file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-[#642a10] ltr:file:mr-5"
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
                                                <a
                                                    href={item?.fileUrl?.file ? item?.fileUrl?.file : URL.createObjectURL(item?.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2"
                                                >
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
                                    <button type="button" className="btn bg-[#642a10] text-white " onClick={handleAddFile}>
                                        Add File
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button type="submit" className="btn !mt-6 bg-[#642a10]  text-white">
                                    {state.submitLoading ? <IconLoader className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            />
        </>
    );
};
export default PrivateRouter(FinancialResults);


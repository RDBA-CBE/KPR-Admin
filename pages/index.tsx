import PrivateRouter from '@/components/Layouts/PrivateRouter';
import Models from '@/src/imports/models.import';
import { useSetState } from '@/utils/functions.utils';
import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const TailwindCards = () => {
    const router = useRouter();

    const { menuId } = router.query;

    const [state, setState] = useSetState({
        menuList: [],
        loading: false,
    });

    const handleClick = (item, index) => {
        router.push({
            pathname: '/financial-results', // Destination path
            query: { menuId: 1 },
        });
    };

    useEffect(() => {
        getSubMenu();
    }, [menuId]);

    const getSubMenu = async () => {
        try {
            setState({ loading: true });
            const res: any = await Models.auth.sub_menu(1);
            setState({ menuList: res?.results, loading: false });
        } catch (error) {
            setState({ loading: false });

            console.log('✌️error --->', error);
        }
    };

    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Dashboard</h5>
                </div>
            </div>
            {state.loading ? (
                <div className="item-center flex h-full w-full justify-center">
                    <span className="m-auto mb-10 inline-block h-14 w-14 animate-[spin_3s_linear_infinite] rounded-full border-8 border-b-success border-l-primary border-r-warning border-t-danger align-middle"></span>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {state.menuList?.map((item, index) => (
                        <div
                            key={index}
                            className=" h-400 flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-4 shadow-md"
                            onClick={() => handleClick(item, index)}
                            style={{ height: '100px' }}
                        >
                            <p className="text-lg font-semibold">{item?.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PrivateRouter(TailwindCards);

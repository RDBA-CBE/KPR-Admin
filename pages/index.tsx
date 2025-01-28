import PrivateRouter from '@/components/Layouts/PrivateRouter';
import { useRouter } from 'next/router';
import React from 'react';

const TailwindCards = () => {
    const router = useRouter();

    const arr = [
        'Annual Reports',
        'Audited / Unaudited Results',
        'Financials – Subsidiary Cos',
        'Uploads',
        'K.P.R.Profile Downloads',
        'Appointment of Independent Directors',
        'Voting Results of AGM and Postal Ballot',
        'Company Information',
        'Con-call Invitations and Transcript',
    ];

    const handleClick = (item, index) => {
        router.push({
            pathname: '/financial-result', // Destination path
            query: { path: index },
        });
    };
    return (
        <>
            <div className="panel mb-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <h5 className="text-lg font-semibold dark:text-white-light">Dashboard</h5>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {arr.map((item, index) => (
                    <div
                        key={index}
                        className=" h-400 flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-4 shadow-md"
                        onClick={() => handleClick(item, index)}
                        style={{ height: '100px' }}
                    >
                        <p className="text-lg font-semibold">{item}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PrivateRouter(TailwindCards);

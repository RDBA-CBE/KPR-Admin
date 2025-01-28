import axios from 'axios';
import React, { useEffect } from 'react';

export default function Test() {
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res: any = await axios.get('https://file.kprmilllimited.com/wp-json/custom-api/v1/cfdb-submissions');
            console.log('res: ', res);
            const separatedData = res?.data.reduce((acc, obj) => {
                const formPostId = obj.form_post_id;
                if (!acc[formPostId]) {
                    acc[formPostId] = [];
                }
                acc[formPostId].push(obj);
                return acc;
            }, {});
            console.log("separatedData: ", separatedData);

            // const parsedData = res.data.map((page) => parseHTMLContent(page.content.rendered)).flat();
        } catch (error) {
            // console.log('error: ', error);
        }
    };
    return <div>test</div>;
}

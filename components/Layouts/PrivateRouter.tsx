import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PrivateRouter = (WrappedComponent:any) => {
  return (props:any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('kprToken');
      if (!token) {
        const baseUrl = `${window.location.origin}/signin`;
        router.replace(baseUrl); // Redirect to login if no token is found
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default PrivateRouter;

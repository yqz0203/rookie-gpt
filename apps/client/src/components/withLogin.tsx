import { useAuthStore } from '../store';
import { Navigate } from 'react-router-dom';

export default function withLogin<T>(Comp: React.ComponentType<T>) {
  const WithLoginComp = (props: T) => {
    const { token } = useAuthStore();

    if (!token) {
      return <Navigate to="/login" replace={true} />;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Comp {...(props as any)} />;
  };

  return WithLoginComp;
}
